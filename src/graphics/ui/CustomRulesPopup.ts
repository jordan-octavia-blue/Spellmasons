import { IGameRules, getDefaultGameRules } from '../../types/GameRules';

let currentPopupElement: HTMLElement | null = null;

export function openCustomRulesPopup(): void {
  if (globalThis.headless) {
    return;
  }

  // Don't open multiple popups
  if (currentPopupElement) {
    return;
  }

  const defaults = getDefaultGameRules();
  // Get current rules from underworld if available, otherwise use defaults
  // @ts-ignore: devUnderworld is available at runtime
  const currentRules: IGameRules = globalThis.devUnderworld?.rules || defaults;

  const el = document.createElement('div');
  el.classList.add('prompt', 'custom-rules-popup', 'forceShow');
  currentPopupElement = el;

  // Build form fields dynamically from IGameRules
  const ruleFields = Object.keys(defaults) as (keyof IGameRules)[];

  const fieldsHtml = ruleFields.map(key => {
    const defaultValue = defaults[key];
    const currentValue = currentRules[key];
    return `
      <div class="custom-rules-field">
        <label for="rule-${key}">${formatRuleName(key)}</label>
        <div class="custom-rules-input-row">
          <input
            type="number"
            id="rule-${key}"
            name="${key}"
            value="${currentValue}"
            data-default="${defaultValue}"
            class="custom-rules-input"
          />
          <span class="custom-rules-default">(Default: ${defaultValue})</span>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="ui-border">
      <div class="prompt-inner" style="min-width: 400px;">
        <div class="prompt-content">
          <h2 style="margin: 0 0 15px 0; text-align: center;">Custom Game Rules</h2>
          <div class="custom-rules-form">
            ${fieldsHtml}
          </div>
        </div>
        <div class="button-holder">
          <button class="defaults-btn button-wrapper">
            <div class="button-inner">Reset to Defaults</div>
          </button>
          <button class="cancel-btn button-wrapper">
            <div class="button-inner">Cancel</div>
          </button>
          <button class="save-btn button-wrapper">
            <div class="button-inner">Save</div>
          </button>
        </div>
      </div>
    </div>
  `;

  // Add inline styles for the custom form elements
  const style = document.createElement('style');
  style.textContent = `
    .custom-rules-popup .custom-rules-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 0;
    }
    .custom-rules-popup .custom-rules-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .custom-rules-popup .custom-rules-field label {
      font-weight: bold;
      color: #ddd;
    }
    .custom-rules-popup .custom-rules-input-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .custom-rules-popup .custom-rules-input {
      padding: 8px 12px;
      font-size: 16px;
      border: 1px solid #666;
      border-radius: 4px;
      background: #222;
      color: white;
      width: 120px;
    }
    .custom-rules-popup .custom-rules-input:focus {
      outline: none;
      border-color: #88f;
    }
    .custom-rules-popup .custom-rules-default {
      color: #888;
      font-size: 12px;
    }
    .custom-rules-popup h2 {
      color: white;
    }
  `;
  el.appendChild(style);

  document.body?.appendChild(el);

  // Event handlers
  const saveBtn = el.querySelector('.save-btn') as HTMLElement | null;
  const cancelBtn = el.querySelector('.cancel-btn') as HTMLElement | null;
  const defaultsBtn = el.querySelector('.defaults-btn') as HTMLElement | null;

  saveBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rules: Partial<IGameRules> = {};

    ruleFields.forEach(key => {
      const input = el.querySelector(`#rule-${key}`) as HTMLInputElement | null;
      if (input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
          (rules as any)[key] = value;
        }
      }
    });

    // Call the global setGameRules function
    if (globalThis.setGameRules) {
      globalThis.setGameRules(rules);
      console.log('Custom rules saved:', rules);
    } else {
      console.error('globalThis.setGameRules is not available');
    }

    closePopup();
  });

  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePopup();
  });

  defaultsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset all inputs to their default values
    ruleFields.forEach(key => {
      const input = el.querySelector(`#rule-${key}`) as HTMLInputElement | null;
      if (input) {
        input.value = input.dataset.default || String(defaults[key]);
      }
    });
  });

  // Close on escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closePopup();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Close on click outside
  el.addEventListener('click', (e) => {
    if (e.target === el) {
      closePopup();
    }
  });

  function closePopup() {
    el.remove();
    currentPopupElement = null;
  }
}

function formatRuleName(key: string): string {
  // Convert PLAYER_BASE_STAMINA to "Player Base Stamina"
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Expose to globalThis
globalThis.openCustomRulesPopup = openCustomRulesPopup;
