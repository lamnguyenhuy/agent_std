export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === "undefined") {
    throw new Error("downloadBlob can only be used in a browser environment")
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.style.display = "none"
  document.body.appendChild(anchor)
  anchor.click()

  // Clean up after generous delay — ensures browser has started download
  setTimeout(() => {
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }, 5000)
}
