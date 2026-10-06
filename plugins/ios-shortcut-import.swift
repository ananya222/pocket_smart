import AppIntents
import CryptoKit
import JavaScriptCore
import FirebaseAuth
import FirebaseFirestore

struct ImportTransactionMessageIntent: AppIntent {
  static var title: LocalizedStringResource = "Import transaction message"
  static var description = IntentDescription("Import an INR debit alert into your signed-in PocketSmart account. Pass the original message and its received date.")
  static var openAppWhenRun = false

  @Parameter(title: "Message text") var message: String
  @Parameter(title: "Received date") var receivedAt: Date

  static var parameterSummary: some ParameterSummary {
    Summary("Import \(.$message) received on \(.$receivedAt)")
  }

  func perform() async throws -> some IntentResult & ProvidesDialog {
    guard !message.isEmpty, message.utf8.count <= 8192,
          receivedAt <= Date().addingTimeInterval(300) else {
      throw importError("Pass a transaction message and a valid received date.")
    }
    if FirebaseApp.app() == nil { FirebaseApp.configure() }
    guard let uid = Auth.auth().currentUser?.uid else {
      throw importError("Open PocketSmart and sign in before importing expenses.")
    }
    let calendar = Calendar.current
    guard calendar.isDate(receivedAt, equalTo: Date(), toGranularity: .month) else {
      throw importError("Only this month's alerts can be imported. Add older expenses manually.")
    }

    // Share the existing parser rather than maintaining a second Swift parser.
    let parser = String(data: Data(base64Encoded: "__POCKETSMART_PARSER_BASE64__")!, encoding: .utf8)!
    guard let context = JSContext() else { throw importError("The message parser could not start.") }
    context.evaluateScript(parser)
    let millis = receivedAt.timeIntervalSince1970 * 1000
    let input: [String: Any] = ["body": message, "date": millis, "sourceId": "shortcut"]
    guard let result = context.objectForKeyedSubscript("parseExpenseSms")?.call(withArguments: [[input]]),
          context.exception == nil, let rows = result.toArray() as? [[String: Any]] else {
      throw importError("The transaction message could not be parsed.")
    }
    guard let row = rows.first else {
      return .result(dialog: "Ignored: this message is not a supported INR expense alert.")
    }
    guard let amount = row["amount"] as? NSNumber, amount.doubleValue.isFinite,
          amount.doubleValue < 0, let title = row["title"] as? String,
          let category = row["category"] as? String else {
      throw importError("The transaction amount could not be verified.")
    }
    // Original received date must be reused on retries, to keep imports idempotent.
    let identity = "\(Int64(millis))\u{0}\(message)"
    let source = SHA256.hash(data: Data(identity.utf8)).map { String(format: "%02x", $0) }.joined()
    let db = Firestore.firestore()
    let user = db.collection("users").document(uid)
    let expense = user.collection("transactions").document("ios_shortcut_\(source)")
    let dateFormatter = DateFormatter()
    dateFormatter.locale = Locale(identifier: "en_IN")
    dateFormatter.dateFormat = "d MMM"
    let dateLabel = dateFormatter.string(from: receivedAt)
    dateFormatter.dateFormat = "MMMM yyyy"
    let monthLabel = dateFormatter.string(from: receivedAt)
    let debit = Decimal(string: amount.stringValue, locale: Locale(identifier: "en_US_POSIX"))!

    let saved = try await db.runTransaction { transaction, errorPointer -> Any? in
      do {
        guard Auth.auth().currentUser?.uid == uid else { throw importError("Your account changed. Run the shortcut again.") }
        let existing = try transaction.getDocument(expense)
        if existing.exists { return false }
        let profile = try transaction.getDocument(user)
        guard let onboarding = profile.data()?["onboarding"] as? [String: Any],
              let refreshed = onboarding["last_refreshed"] as? Timestamp,
              calendar.isDate(refreshed.dateValue(), equalTo: Date(), toGranularity: .month),
              let balanceValue = onboarding["current_balance"] ?? onboarding["currentBalance"],
              let balance = Decimal(string: String(describing: balanceValue).replacingOccurrences(of: ",", with: ""), locale: Locale(identifier: "en_US_POSIX")) else {
          throw importError("Open PocketSmart to finish onboarding or refresh this month's balance, then retry.")
        }
        let nextBalance = NSDecimalNumber(decimal: balance + debit)
        transaction.updateData(["onboarding.current_balance": nextBalance.stringValue], forDocument: user)
        transaction.setData([
          "title": title, "category": category, "amount": amount.doubleValue,
          "date": dateLabel, "monthLabel": monthLabel, "created_at": Timestamp(date: receivedAt),
          "import_source": "ios_shortcut", "sms_source_id": source,
        ], forDocument: expense)
        return true
      } catch {
        errorPointer?.pointee = error as NSError
        return nil
      }
    }
    return .result(dialog: (saved as? Bool == true) ? "Expense imported into PocketSmart." : "This message was already imported.")
  }
}

private func importError(_ message: String) -> NSError {
  NSError(domain: "PocketSmart.ShortcutImport", code: 1, userInfo: [NSLocalizedDescriptionKey: message])
}
