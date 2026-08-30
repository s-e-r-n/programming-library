"use strict";

const storageKey = "programming-library:titles:v1";
let savedTitles = {};

try {
  savedTitles = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  savedTitles = {};
}

document.querySelectorAll("[data-document-id]").forEach((documentCard) => {
  const id = documentCard.dataset.documentId;
  const title = documentCard.querySelector(".title");
  const renameButton = documentCard.querySelector(".rename-button");
  let originalTitle = title.textContent.trim();

  if (typeof savedTitles[id] === "string") {
    title.textContent = savedTitles[id];
    originalTitle = savedTitles[id];
    renameButton.setAttribute("aria-label", `Renommer ${savedTitles[id]}`);
  }

  const finishRenaming = () => {
    const normalizedTitle = title.textContent.trim() || originalTitle;

    title.textContent = normalizedTitle;
    title.removeAttribute("contenteditable");
    title.removeAttribute("role");
    title.removeAttribute("aria-label");
    documentCard.classList.remove("is-renaming");
    renameButton.setAttribute("aria-label", `Renommer ${normalizedTitle}`);
    savedTitles[id] = normalizedTitle;
    localStorage.setItem(storageKey, JSON.stringify(savedTitles));
    originalTitle = normalizedTitle;
  };

  renameButton.addEventListener("pointerdown", (event) => {
    if (title.isContentEditable) {
      event.preventDefault();
    }
  });

  renameButton.addEventListener("click", () => {
    if (title.isContentEditable) {
      title.blur();
      return;
    }

    originalTitle = title.textContent.trim();
    documentCard.classList.add("is-renaming");
    title.setAttribute("contenteditable", "true");
    title.setAttribute("role", "textbox");
    title.setAttribute("aria-label", "Nouveau titre");
    title.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(title);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  title.addEventListener("click", (event) => {
    if (title.isContentEditable) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  title.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      title.blur();
    }

    if (event.key === "Escape") {
      title.textContent = originalTitle;
      title.blur();
    }
  });

  title.addEventListener("blur", finishRenaming);
});
