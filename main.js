(function () {
  const gotoInput = document.querySelector('#position');
  const gotoButton = document.querySelector('#goToPosition');
  const positionError = document.querySelector('#positionError');
  gotoInput.addEventListener('paste', (e) => {
    e.stopPropagation();
  });

  // input entry event
  gotoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      gotoButton.click();
    }
  });

  gotoButton.addEventListener('click', () => {
    const v = gotoInput.value;
    const pos = v
      .split(':')
      .map((x) => parseInt(x, 10))
      .filter((x) => Number.isSafeInteger(x));
    let [line, col] = pos;
    if (col === undefined) col = 1;
    if (line > 0 && col > 0) {
      window.generatedTextArea.scrollTo(col, line - 1);
      const hover = window.generatedTextArea.findHover(line - 1, col);
      if (hover && hover.mapping) {
        positionError.innerText = ``;
        window.generatedTextArea.setHover(hover);

        const fileList = document.querySelector('#fileList');
        fileList.selectedIndex = hover.mapping.originalSource;
        const originalTextArea = window.getOriginalTextArea();
        if (originalTextArea.sourceIndex !== hover.mapping.originalSource) {
          fileList.selectedIndex = hover.mapping.originalSource;

          fileList.onchange().then(() => {
            const originalTextArea = window.getOriginalTextArea();
            originalTextArea.scrollTo(hover.mapping.originalColumn, hover.mapping.originalLine);
          });
          fileList.dispatchEvent(new Event('change'));
        } else {
          originalTextArea.scrollTo(hover.mapping.originalColumn, hover.mapping.originalLine);
        }
      } else {
        positionError.innerText = `Can't find mapping at "${v}"`;
      }
    } else {
      positionError.innerText = `Please enter a valid position`;
    }
  });
})();
