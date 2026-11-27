import { useSettings, type Lang, type Theme } from '../../stores/settings';

export function SettingsPage() {
  const { theme, lang, setTheme, setLang } = useSettings();
  return (
    <section className="stack">
      <h1>الإعدادات</h1>
      <div className="card stack">
        <label>
          المظهر
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
            <option value="system">حسب النظام</option>
            <option value="dark">داكن</option>
            <option value="light">فاتح</option>
          </select>
        </label>
        <label>
          اللغة والاتجاه
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            <option value="ar">العربية (RTL)</option>
            <option value="en">English (LTR)</option>
          </select>
        </label>
        <p className="muted">كل بياناتك محفوظة على هذا الجهاز فقط (IndexedDB). لا شيء يُرسل خارجه.</p>
      </div>
    </section>
  );
}
