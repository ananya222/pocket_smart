# Optional iOS transaction-message import

Status: first implementation; not yet compiled or tested on an Apple device.

The native `Import transaction message` App Intent uses PocketSmart's existing
INR debit parser. It saves an expense and updates the signed-in user's balance
in one Firestore transaction. Raw message text is not saved to Firestore.
It does not read the inbox or request Android SMS permissions.

## User setup on iOS 26

1. Install the new signed build, sign in, complete onboarding, and open the dashboard.
2. In Shortcuts, create a Message personal automation for your bank sender or a
   financial keyword such as `debited`. Select Run Immediately.
3. Add PocketSmart's `Import transaction message` action.
4. Set Message text to the incoming message's content from Shortcut Input.
5. Set Received date to the original received date if supplied by the trigger.
   Otherwise capture Current Date once in a variable and pass that variable.
6. Test with a sample INR debit alert before enabling this for actual expenses.

Retries must use exactly the same text and date: these form the duplicate key.
Do not re-run a failed import with a newly generated Current Date if the first
attempt may have committed. Such a run would count as another expense.
Credit, refund, OTP, failed-payment and unsupported messages are ignored.
Only current-month alerts are accepted. At a month boundary, open the app first
to refresh the allowance; the action fails clearly rather than changing months
in the background. It requires network access; no offline retry queue is included.

## Verification still needed

Build with macOS/Xcode or EAS to validate App Intents and native linking. Test
discovery in Shortcuts, locked-device execution, persisted Firebase sign-in,
Firestore security rules, cancellation/failure, duplicates, account changes,
month boundaries and atomic balance updates on a real iPhone.
An iPad can exercise the action with supplied text; it does not replace testing
incoming bank messages on an iPhone.

The Expo plugin embeds the shared parser and Swift action into the existing
AppDelegate compilation unit, including after prebuild. No extra native
dependencies or manual Xcode source-file registrations are needed.
