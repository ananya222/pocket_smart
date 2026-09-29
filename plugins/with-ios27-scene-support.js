const { withAppDelegate, withInfoPlist, withPodfile } = require('@expo/config-plugins');

const POD_DEPLOYMENT_TARGET_HOOK = `
    # Xcode 27 requires every CocoaPods target to use iOS 15 or newer.
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_configuration|
        build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '26.0'
      end
    end
`;

function withIos27SceneSupport(config) {
  config = withAppDelegate(config, (config) => {
    const appDelegate = config.modResults;
    if (appDelegate.language !== 'swift') {
      throw new Error('iOS 27 scene support currently expects a Swift AppDelegate.');
    }

    let contents = appDelegate.contents;
    if (!contents.includes('class SceneDelegate: UIResponder, UIWindowSceneDelegate')) {
      const windowCreation = /^\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*$/m;
      const reactNativeStartup = /^\s*factory\.startReactNative\(\s*withModuleName: "main",\s*in: window,\s*launchOptions: launchOptions\)\s*$/m;
      if (!windowCreation.test(contents) || !reactNativeStartup.test(contents)) {
        throw new Error('Could not find Expo’s legacy AppDelegate window startup to move into a scene delegate.');
      }

      contents = contents.replace(windowCreation, '').replace(reactNativeStartup, '');
      contents = `${contents.trimEnd()}\n\n${sceneDelegateSource}`;
    }

    if (!contents.includes('#if DEBUG\nimport EXDevLauncher\n#endif')) {
      contents = contents.replace('import Expo\n', 'import Expo\n#if DEBUG\nimport EXDevLauncher\n#endif\n');
    }
    if (!contents.includes('var launchOptions: [UIApplication.LaunchOptionsKey: Any]?')) {
      contents = contents.replace(
        '  var window: UIWindow?\n',
        '  var window: UIWindow?\n  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?\n'
      );
    }
    if (!contents.includes('self.launchOptions = launchOptions')) {
      contents = contents.replace(
        '    bindReactNativeFactory(factory)\n',
        '    bindReactNativeFactory(factory)\n    self.launchOptions = launchOptions\n'
      );
    }

    appDelegate.contents = contents;
    return config;
  });

  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return config;
  });

  config = withPodfile(config, (config) => {
    let contents = config.modResults.contents;
    const marker = "build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '26.0'";
    if (!contents.includes(marker)) {
      const postInstallEnd = contents.lastIndexOf('\n  end\nend');
      if (postInstallEnd < 0 || !contents.includes('post_install do |installer|')) {
        throw new Error('Could not find CocoaPods post_install block to set supported iOS deployment targets.');
      }
      contents = `${contents.slice(0, postInstallEnd)}${POD_DEPLOYMENT_TARGET_HOOK}${contents.slice(postInstallEnd)}`;
    }
    config.modResults.contents = contents;
    return config;
  });

  return config;
}

const sceneDelegateSource = `
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
`;

module.exports = withIos27SceneSupport;
