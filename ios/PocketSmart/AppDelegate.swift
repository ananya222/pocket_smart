import Expo
#if DEBUG
import EXDevLauncher
#endif
import FirebaseCore
import React
import ReactAppDependencyProvider

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)
    self.launchOptions = launchOptions

#if os(iOS) || os(tvOS)
// @generated begin @react-native-firebase/app-didFinishLaunchingWithOptions - expo prebuild (DO NOT MODIFY) sync-10e8520570672fd76b2403b7e1e27f5198a6349a
FirebaseApp.configure()
// @generated end @react-native-firebase/app-didFinishLaunchingWithOptions
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Linking API
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  // Universal Links
  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  // Extension point for config-plugins

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard
      let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    appDelegate.window = window
    factory.startReactNative(withModuleName: "main", in: window, launchOptions: appDelegate.launchOptions)
#if DEBUG
    EXDevLauncherController.sharedInstance().autoSetupStart(window)
#endif

    for context in connectionOptions.urlContexts {
      _ = appDelegate.application(
        UIApplication.shared,
        open: context.url,
        options: legacyOpenURLOptions(for: context)
      )
    }
    for userActivity in connectionOptions.userActivities {
      _ = appDelegate.application(
        UIApplication.shared,
        continue: userActivity,
        restorationHandler: { _ in }
      )
    }
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
    for context in URLContexts {
      _ = appDelegate.application(
        UIApplication.shared,
        open: context.url,
        options: legacyOpenURLOptions(for: context)
      )
    }
  }

  private func legacyOpenURLOptions(
    for context: UIOpenURLContext
  ) -> [UIApplication.OpenURLOptionsKey: Any] {
    var options: [UIApplication.OpenURLOptionsKey: Any] = [
      .openInPlace: context.options.openInPlace,
    ]
    if let sourceApplication = context.options.sourceApplication {
      options[.sourceApplication] = sourceApplication
    }
    if let annotation = context.options.annotation {
      options[.annotation] = annotation
    }
    return options
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
    _ = appDelegate.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}

// @generated begin pocketsmart-shortcut-import
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
    let parser = String(data: Data(base64Encoded: "Y29uc3QgYW1vdW50UGF0dGVybiA9IC8oPzrigrl8XGIoPzpJTlJ8UnNcLj98cnVwZWVzPylccyopXHMqKFswLTldWzAtOSxdKig/OlwuXGR7MSwyfSk/KS9naTsKY29uc3Qgc3BlbmRQYXR0ZXJuID0gL1xiKD86ZGViaXRlZHxzcGVudHxwdXJjaGFzZVtkc10/fHBhaWR8cGF5bWVudFxzKyg/Om9mfGZvcil8c2VudFxzKyg/OnRvfHZpYSl8d2l0aGRyYXdufHdpdGhkcmF3YWx8dHJhbnNmZXJyZWR8dHhufHRyYW5zYWN0aW9ufGRlYml0XHMrKD86Y2FyZHx0cmFuc2FjdGlvbikpXGIvaTsKY29uc3Qgbm9uRXhwZW5zZVBhdHRlcm4gPSAvXGIoPzpjcmVkaXRlZHxyZWZ1bmQoPzplZCk/fGNhc2hiYWNrfHJlY2VpdmVkfGZhaWxlZHxkZWNsaW5lZHxyZXZlcnNlZHxkZXBvc2l0ZWR8cmV0dXJuZWQpXGIvaTsKY29uc3QgdmVyaWZpY2F0aW9uUGF0dGVybiA9IC9cYig/Om90cHxvbmVbIC1ddGltZVsgLV0oPzpwYXNzd29yZHxjb2RlKXx2ZXJpZmljYXRpb24gY29kZSlcYi9pOwoKY29uc3QgY2F0ZWdvcmllcyA9IFsKICBbIkZvb2QgJiBEcmlua3MiLCAvZm9vZHxyZXN0YXVyYW50fGNhZmV8Y29mZmVlfHN3aWdneXx6b21hdG98ZGluaW5nfGJha2VyeS9pXSwKICBbIlRyYW5zcG9ydCIsIC91YmVyfG9sYXxtZXRyb3xmdWVsfHBldHJvbHxkaWVzZWx8YnVzfHRyYWlufHJhcGlkby9pXSwKICBbIlNob3BwaW5nIiwgL2FtYXpvbnxmbGlwa2FydHxteW50cmF8c2hvcHBpbmd8cmV0YWlsL2ldLAogIFsiRW50ZXJ0YWlubWVudCIsIC9uZXRmbGl4fHNwb3RpZnl8Y2luZW1hfG1vdmllfHB2cnxib29rbXlzaG93L2ldLAogIFsiQmlsbHMgJiBVdGlsaXRpZXMiLCAvZWxlY3RyaWNpdHl8d2F0ZXIgYmlsbHxnYXMgYmlsbHxicm9hZGJhbmR8bW9iaWxlIHJlY2hhcmdlL2ldLApdOwoKY29uc3QgbWVyY2hhbnRGcm9tID0gKGJvZHkpID0+IHsKICBjb25zdCBtYXRjaCA9IGJvZHkubWF0Y2goL1xiKD86YXR8dG98dG93YXJkc3xtZXJjaGFudClccypbOlwtXT9ccyooW0EtWjAtOV1bQS1aMC05ICYuJ0AvXy1dezEsNDB9PykoPz1ccysoPzpvbnx1c2luZ3x2aWF8dGhyb3VnaHxyZWYoPzplcmVuY2UpP3x0eG58dHJhbnNhY3Rpb258dXBpfGNhcmR8ZGF0ZWQpXGJ8Wy4sO1xuXXwkKS9pKTsKICByZXR1cm4gbWF0Y2g/LlsxXT8udHJpbSgpIHx8ICgvXGJ1cGlcYi9pLnRlc3QoYm9keSkgPyAiVVBJIHBheW1lbnQiIDogL1xiY2FyZFxiL2kudGVzdChib2R5KSA/ICJDYXJkIHB1cmNoYXNlIiA6ICJCYW5rIGV4cGVuc2UiKTsKfTsKCmZ1bmN0aW9uIHBhcnNlRXhwZW5zZVNtcyhtZXNzYWdlcykgewogIHJldHVybiBtZXNzYWdlcy5mbGF0TWFwKChtZXNzYWdlKSA9PiB7CiAgICBjb25zdCBib2R5ID0gU3RyaW5nKG1lc3NhZ2UuYm9keSB8fCAiIik7CiAgICBpZiAoIXNwZW5kUGF0dGVybi50ZXN0KGJvZHkpIHx8IG5vbkV4cGVuc2VQYXR0ZXJuLnRlc3QoYm9keSkgfHwgdmVyaWZpY2F0aW9uUGF0dGVybi50ZXN0KGJvZHkpKSByZXR1cm4gW107CiAgICBjb25zdCBhbW91bnRNYXRjaCA9IFsuLi5ib2R5Lm1hdGNoQWxsKGFtb3VudFBhdHRlcm4pXVswXTsKICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihhbW91bnRNYXRjaD8uWzFdPy5yZXBsYWNlQWxsKCIsIiwgIiIpKTsKICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGFtb3VudCkgfHwgYW1vdW50IDw9IDApIHJldHVybiBbXTsKCiAgICBjb25zdCB0aXRsZSA9IG1lcmNoYW50RnJvbShib2R5KTsKICAgIGNvbnN0IGNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maW5kKChbLCBwYXR0ZXJuXSkgPT4gcGF0dGVybi50ZXN0KGAke3RpdGxlfSAke2JvZHl9YCkpPy5bMF0gfHwgIk1pc2MiOwogICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKE51bWJlcihtZXNzYWdlLmRhdGUpKTsKICAgIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gW107CgogICAgcmV0dXJuIFt7CiAgICAgIHNvdXJjZUlkOiBtZXNzYWdlLnNvdXJjZUlkLAogICAgICB0aXRsZSwKICAgICAgY2F0ZWdvcnksCiAgICAgIGFtb3VudDogLWFtb3VudCwKICAgICAgdGltZXN0YW1wOiBkYXRlLmdldFRpbWUoKSwKICAgICAgZGF0ZUxhYmVsOiBgJHtkYXRlLmdldERhdGUoKX0gJHtkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygiZW4tSU4iLCB7IG1vbnRoOiAic2hvcnQiIH0pfWAsCiAgICAgIG1vbnRoTGFiZWw6IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCJlbi1JTiIsIHsgbW9udGg6ICJsb25nIiwgeWVhcjogIm51bWVyaWMiIH0pLAogICAgfV07CiAgfSk7Cn0K")!, encoding: .utf8)!
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
// @generated end pocketsmart-shortcut-import
