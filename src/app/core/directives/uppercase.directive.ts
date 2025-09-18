import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const upperValue = value.toUpperCase();

    if (value !== upperValue) {
      const start = input.selectionStart;
      const end = input.selectionEnd;

      this.renderer.setProperty(input, 'value', upperValue);

      if (start !== null && end !== null) {
        input.setSelectionRange(start, end);
      }

      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const input = this.el.nativeElement as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';
    const upperText = pastedText.toUpperCase();

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;

    const newValue =
      currentValue.substring(0, start) +
      upperText +
      currentValue.substring(end);

    this.renderer.setProperty(input, 'value', newValue);

    const newCursorPos = start + upperText.length;
    input.setSelectionRange(newCursorPos, newCursorPos);

    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ];

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (allowedKeys.includes(event.key)) {
      return;
    }
  }
}
