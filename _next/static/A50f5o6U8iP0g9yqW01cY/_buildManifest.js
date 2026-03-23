self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/meinjobbi-dev/proxy/:path*"
      }
    ],
    "beforeFiles": [
      {
        "source": "/meinjobbi-dev//_next/:path+",
        "destination": "/meinjobbi-dev/_next/:path+"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()