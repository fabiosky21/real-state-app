const config = {
  appId: 'com.realstate.app',
  appName: 'real-state',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '208079861547-gjaj7lu1qdgt3517n5l039ic4kde9ktg.apps.googleusercontent.com', 
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
