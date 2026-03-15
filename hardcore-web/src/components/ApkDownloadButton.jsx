const APK_URL = 'https://expo.dev/artifacts/eas/xyhKeK4aMzEWaCChAaHSy4.apk';

export default function ApkDownloadButton() {
  return (
    <a
      href={APK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
      aria-label="Download Android APK"
    >
      Download APK
    </a>
  );
}