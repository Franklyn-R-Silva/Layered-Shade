export class NotificationManager {
  constructor(copyTextElement, copyBtnElement) {
    this.copyText = copyTextElement;
    this.copyBtn = copyBtnElement;
  }

  /**
   * Maps an active tab id to its human-readable label.
   * @param {string} activeTab - One of 'css', 'dart', 'tailwind'
   * @returns {string} Display label
   */
  getTabLabel(activeTab) {
    const labels = { css: "CSS", dart: "Dart", tailwind: "Tailwind" };
    return labels[activeTab] || "CSS";
  }

  showCopyFeedback(activeTab) {
    this.copyText.textContent = "Copiado com sucesso!";
    this.copyBtn.classList.add("copied");

    setTimeout(() => {
      this.copyText.textContent = `Clique aqui para copiar as regras (${this.getTabLabel(activeTab)})`;
      this.copyBtn.classList.remove("copied");
    }, 2000);
  }

  updateCopyButtonText(activeTab) {
    this.copyText.textContent = `Clique aqui para copiar as regras (${this.getTabLabel(activeTab)})`;
  }
}
