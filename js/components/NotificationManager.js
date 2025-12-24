export class NotificationManager {
  constructor(copyTextElement, copyBtnElement) {
    this.copyText = copyTextElement;
    this.copyBtn = copyBtnElement;
  }

  showCopyFeedback(activeTab) {
    this.copyText.textContent = "Copiado com sucesso!";
    this.copyBtn.classList.add("copied");

    setTimeout(() => {
      const label = activeTab === "css" ? "CSS" : "Dart";
      this.copyText.textContent = `Clique aqui para copiar as regras (${label})`;
      this.copyBtn.classList.remove("copied");
    }, 2000);
  }

  updateCopyButtonText(activeTab) {
    const label = activeTab === "css" ? "CSS" : "Dart";
    this.copyText.textContent = `Clique aqui para copiar as regras (${label})`;
  }
}
