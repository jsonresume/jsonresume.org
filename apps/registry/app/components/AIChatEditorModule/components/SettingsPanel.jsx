const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full
      ${enabled ? 'bg-blue-500' : 'bg-gray-200'}
      transition-colors duration-200
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

export const SettingsPanel = ({ settings, updateSettings }) => {
  return (
    <div className="px-4 pb-4">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Settings</h3>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-700">Text-to-Speech</label>
            <p className="text-xs text-gray-500">
              AI assistant speaks responses
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.ttsEnabled}
            onChange={() =>
              updateSettings({ ttsEnabled: !settings.ttsEnabled })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-700">Auto-Apply Changes</label>
            <p className="text-xs text-gray-500">
              Automatically apply suggested changes
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.autoApplyChanges}
            onChange={() =>
              updateSettings({ autoApplyChanges: !settings.autoApplyChanges })
            }
          />
        </div>
      </div>
    </div>
  );
};
