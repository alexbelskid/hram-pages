import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  FileText,
  LogOut,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import headerChapel from './assets/header-chapel.jpg';
import crossSymbol from './assets/cross-celtic.png';
import akafistKrest from './assets/akafist-krest.jpg';
import akafistMlekopitatelnitsa from './assets/akafist-mlekopitatelnitsa.jpg';
import {
  changeNoteStatus,
  createNote,
  getPrintDocument,
  listNotes,
  validateAdminSession,
  type ChurchNote,
  type NoteStatus,
} from './api.ts';

const TREBAS = ['Проскомидия', 'Обедня', 'Молебен', 'Панихида', 'Акафист', 'Сорокоуст'];
const NOTE_PRICES: Record<string, number> = {
  Проскомидия: 3,
  Обедня: 8,
  Молебен: 5,
  Панихида: 5,
  Акафист: 8,
};

const statusLabels: Record<NoteStatus, string> = {
  pending_payment: 'Ожидает оплаты',
  paid: 'Оплачена',
  printing: 'Печатается',
  completed: 'Обработана',
  cancelled: 'Отменена',
  refunded: 'Возвращена',
};

const LogoSeal = () => (
  <div className="flex items-center justify-center mb-8 mt-2 gap-[14px]">
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]" />
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]" />
    <img src={crossSymbol} alt="Крест" className="mx-2 w-[72px] h-[72px] object-contain" />
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]" />
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]" />
  </div>
);

const IntroText = () => (
  <div className="bg-[#fcfaf5] px-6 py-10 text-[15.5px] leading-[1.6] text-gray-800 space-y-6">
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#942e39] text-xl font-bold text-[#942e39]">
        !
      </div>
      <p className="text-[16px] font-medium leading-snug text-[#942e39]">
        Обращаем ваше внимание, что за самоубийц не совершается церковное поминовение об упокоении, кроме как по благословению архиерея.
      </p>
    </div>

    <p>
      Мы принимаем записки о здравии и об упокоении, а также вы можете заказать сорокоуст, молебен, акафист, обедню и другие требы. Записки на пост принимаются только во время Рождественского и Великого поста.
    </p>
    <p>
      Подавая записку за христианина католического вероисповедания либо за некрещеного, обязательно указывайте это в записке рядом с именем.
    </p>

    <p>
      В случае возникновения вопросов обращайтесь в службу технической поддержки по электронной почте:
      <br />
      <a href="mailto:Alexbelskid@gmail.com" className="text-[#942e39]">
        Alexbelskid@gmail.com
      </a>
    </p>
  </div>
);

const SiteInformation = () => (
  <section className="bg-[#f4efe7] px-6 py-10 text-gray-800" aria-labelledby="site-information-title">
    <h2 id="site-information-title" className="text-center text-[25px] font-bold uppercase tracking-wide text-[#8b3034]">
      Информация об услугах и оплате
    </h2>
    <p className="mt-3 text-center text-[16px] leading-[1.6] text-gray-600">
      Сайт проходит подготовку к подключению онлайн-платежей. Сейчас банковские карты и платёжные данные на этой странице не принимаются.
    </p>

    <nav className="mt-7 grid grid-cols-2 gap-3" aria-label="Разделы с информацией">
      {[
        ['services', 'Услуги'],
        ['payment', 'Оплата'],
        ['refund', 'Возврат'],
        ['details', 'Реквизиты'],
      ].map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#cdbdb0] bg-[#fcfaf5] px-3 py-3 text-center text-[16px] font-bold text-[#8b3034]"
        >
          {label}
        </a>
      ))}
    </nav>

    <div className="mt-8 space-y-5">
      <article id="services" className="scroll-mt-4 rounded-2xl bg-[#fcfaf5] p-5 shadow-sm">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <FileText className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Оказываемые услуги</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          На сайте можно подготовить церковную записку о здравии или об упокоении и выбрать требу: Проскомидию, Обедню, Молебен, Панихиду, Акафист или Сорокоуст. Итоговая сумма пожертвования показывается до подтверждения формы и зависит от выбранной требы и количества имён.
        </p>
      </article>

      <article id="payment" className="scroll-mt-4 rounded-2xl bg-[#fcfaf5] p-5 shadow-sm">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <ShieldCheck className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Оплата и безопасность</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          Онлайн-оплата пока не подключена. Сайт не запрашивает номер карты, срок её действия или CVC/CVV-код. После заключения договора с платёжным провайдером здесь будут опубликованы поддерживаемые способы оплаты, правила проведения платежа и официальные логотипы платёжных систем.
        </p>
      </article>

      <article id="refund" className="scroll-mt-4 rounded-2xl bg-[#fcfaf5] p-5 shadow-sm">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <RotateCcw className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Отмена и возврат</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          До подключения платежей возврат через сайт не производится, поскольку сайт не принимает деньги. Окончательный порядок отмены записки и возврата платежа будет опубликован после его утверждения организацией и согласования с платёжным провайдером.
        </p>
      </article>

      <article id="details" className="scroll-mt-4 rounded-2xl bg-[#fcfaf5] p-5 shadow-sm">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <Building2 className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Контакты и реквизиты</h3>
        </div>
        <dl className="mt-3 space-y-3 text-[16px] leading-[1.6]">
          <div>
            <dt className="font-bold">Техническая поддержка</dt>
            <dd>
              <a href="mailto:Alexbelskid@gmail.com" className="text-[#8b3034] underline">
                Alexbelskid@gmail.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-bold">Юридические реквизиты организации</dt>
            <dd className="text-gray-600">Будут опубликованы после получения и проверки официальных данных.</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
);

function newIdempotencyKey() {
  return `note-${crypto.randomUUID()}`;
}

function PublicForm({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [treba, setTreba] = useState('Выберите требу');
  const [names, setNames] = useState<string[]>(Array(4).fill(''));
  const [type, setType] = useState<'zdravie' | 'upokoenie'>('zdravie');
  const [duration, setDuration] = useState('40 дней');
  const [akafistTarget, setAkafistTarget] = useState('Христу');
  const [senderName, setSenderName] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  const [created, setCreated] = useState<ChurchNote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const filledNames = names.map(name => name.trim()).filter(Boolean);
  const selected = treba !== 'Выберите требу';
  const notePrice = NOTE_PRICES[treba] ?? 0;
  const amount = treba === 'Сорокоуст'
    ? filledNames.length * 10
    : notePrice > 0 && filledNames.length > 0
      ? Math.ceil(filledNames.length / 12) * notePrice
      : 0;

  function reset() {
    setTreba('Выберите требу');
    setNames(Array(4).fill(''));
    setType('zdravie');
    setDuration('40 дней');
    setAkafistTarget('Христу');
    setSenderName('');
    setCreated(null);
    setError('');
    setIdempotencyKey(newIdempotencyKey());
  }

  async function submit() {
    if (!selected || filledNames.length === 0 || !senderName.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await createNote({
        treba,
        type,
        names: filledNames,
        senderName: senderName.trim(),
        duration: treba === 'Сорокоуст' ? duration : undefined,
        akafistTarget: treba === 'Акафист' ? akafistTarget : undefined,
      }, idempotencyKey);
      setCreated(result.note);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось создать записку');
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <main className="min-h-screen bg-[#8b97a2] flex justify-center p-4 md:p-10">
        <section className="w-full max-w-[540px] rounded-[28px] bg-[#fcfaf5] px-7 py-12 text-center shadow-2xl">
          <img src={crossSymbol} alt="Крест" className="mx-auto h-20 w-20 object-contain" />
          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#8b3034] text-white">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-[28px] font-bold uppercase text-[#8b3034]">Записка подготовлена</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-700">
            Номер: <strong>{created.id}</strong>. Рекомендуемая сумма пожертвования: {created.amount} {created.currency}.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f1ece3] p-4 text-left text-[15px] text-gray-700">
            <strong>Следующий шаг:</strong> оплата пока не подключена, поэтому записка сохранена в тестовой очереди и не считается оплаченной. После подключения платёжной системы здесь появится безопасный переход к оплате.
          </div>
          <button onClick={reset} className="mt-8 w-full rounded-2xl bg-[#8b3034] py-4 text-[18px] font-bold uppercase text-white">
            Создать ещё записку
          </button>
          <button onClick={onOpenAdmin} className="mt-3 w-full rounded-2xl border border-[#8b3034] py-3 text-[16px] font-bold text-[#8b3034]">
            Открыть админку
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#8b97a2] font-sans">
      <div className="mx-auto w-full max-w-[540px] shadow-2xl">
        <section className="rounded-b-[32px] bg-[#fcfaf5] pb-11">
          <header className="relative flex h-[240px] items-center justify-center overflow-hidden">
            <img src={headerChapel} alt="Часовня внутри храма" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 px-5 text-center text-white">
              <h1 className="text-[32px] font-bold uppercase tracking-widest">Подать записку</h1>
              <p className="mt-3 text-[15px]">Выберите службу, укажите имена и проверьте сумму пожертвования</p>
            </div>
          </header>

          <LogoSeal />
          <div className="px-6">
            <div className="relative mb-7">
              <label htmlFor="treba" className="sr-only">Выберите требу</label>
              <select
                id="treba"
                value={treba}
                onChange={event => {
                  const value = event.target.value;
                  setTreba(value);
                  if (value === 'Панихида') setType('upokoenie');
                  if (value === 'Молебен' || value === 'Акафист') setType('zdravie');
                }}
                className="w-full appearance-none rounded-full border-[1.5px] border-[#8b3034] bg-[#fcfaf5] px-6 py-4 text-center text-[20px] font-bold uppercase text-[#8b3034] outline-none"
              >
                <option disabled>Выберите требу</option>
                {TREBAS.map(item => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-4 h-7 w-7 text-[#8b3034]" />
            </div>

            {selected && (
              <div className="mb-7 space-y-5">
                <div className="flex gap-3">
                  {treba !== 'Панихида' && (
                    <button type="button" onClick={() => setType('zdravie')} className={`flex flex-1 items-center justify-center rounded-2xl border-2 py-4 ${type === 'zdravie' ? 'border-[#d24c58] bg-[#d24c58] text-white' : 'border-[#d24c58] text-[#d24c58]'}`}>
                      {type === 'zdravie' ? <CheckCircle2 className="mr-2" /> : <Circle className="mr-2" />}о здравии
                    </button>
                  )}
                  {!['Молебен', 'Акафист'].includes(treba) && (
                    <button type="button" onClick={() => setType('upokoenie')} className={`flex flex-1 items-center justify-center rounded-2xl border-2 py-4 ${type === 'upokoenie' ? 'border-[#40434f] bg-[#40434f] text-white' : 'border-[#40434f] text-[#40434f]'}`}>
                      {type === 'upokoenie' ? <CheckCircle2 className="mr-2" /> : <Circle className="mr-2" />}об упокоении
                    </button>
                  )}
                </div>

                {treba === 'Сорокоуст' && (
                  <button type="button" onClick={() => setDuration('40 дней')} className="w-full rounded-2xl border border-[#8faad9] bg-white py-4 font-bold text-gray-700">
                    <CheckCircle2 className="mr-2 inline h-5 w-5 text-[#8faad9]" />{duration}
                  </button>
                )}

                {treba === 'Акафист' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'Христу', label: 'Честному Кресту Господню', image: akafistKrest },
                      { value: 'Млекопитательница', label: 'Божией Матери «Млекопитательница»', image: akafistMlekopitatelnitsa },
                    ].map(option => (
                      <button type="button" key={option.value} onClick={() => setAkafistTarget(option.value)} className="text-center">
                        <img src={option.image} alt={option.label} className={`mx-auto h-28 w-28 rounded-full border-4 object-cover ${akafistTarget === option.value ? 'border-[#8b3034]' : 'border-transparent'}`} />
                        <span className="mt-2 block text-[14px] text-[#8b3034]">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {names.map((name, index) => (
                <label key={index} className="flex items-end gap-3">
                  <span className="min-w-6 text-right text-[18px] text-[#8b3034]">{index + 1}.</span>
                  <span className="sr-only">Имя {index + 1} в родительном падеже</span>
                  <input value={name} onChange={event => setNames(current => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="Имя в родительном падеже" className="flex-1 border-b border-[#8b3034] bg-transparent px-1 py-2 text-[17px] outline-none" />
                </label>
              ))}
            </div>
            <button type="button" onClick={() => setNames(current => [...current, ''])} className="mx-auto mt-7 block rounded-xl bg-[#c2b6a5] px-7 py-3 font-bold text-white">Добавить ещё имя</button>
          </div>
        </section>

        <section className="space-y-7 px-6 py-9">
          <label className="block">
            <span className="mb-2 block text-[14px] font-bold uppercase text-white">Имя отправителя</span>
            <input value={senderName} onChange={event => setSenderName(event.target.value)} placeholder="Ваше имя" className="w-full rounded-2xl bg-[#fcfaf5] px-5 py-4 text-[18px] outline-none" />
          </label>
          <div className="text-center text-white">
            <div className="text-[19px] font-bold">Рекомендуемая сумма пожертвования</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#a2aab2] py-4 text-[28px] font-bold text-[#697481]">{amount}</div>
              <div className="rounded-2xl bg-[#fcfaf5] py-4 text-[28px] font-bold text-[#8b3034]">BYN</div>
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-100 p-3 text-center text-red-800">{error}</p>}
          <button onClick={submit} disabled={!selected || !filledNames.length || !senderName.trim() || submitting} className="w-full rounded-2xl bg-[#fcfaf5] py-5 text-[21px] font-bold uppercase text-[#8b3034] disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Создаём…' : 'Продолжить'}
          </button>
          <button onClick={onOpenAdmin} className="w-full py-2 text-center text-[15px] font-bold text-white underline">Вход для администратора</button>
        </section>

        <section className="bg-[#fcfaf5] px-6 py-9 text-[15px] leading-relaxed text-gray-700">
          <div className="flex items-start gap-3 rounded-2xl bg-[#f4efe7] p-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#8b3034]" />
            <p><strong>Оплата ещё не подключена.</strong> Сейчас можно проверить форму и подготовить записку. Банковские данные на этой странице не запрашиваются.</p>
          </div>
        </section>

        <IntroText />
        <SiteInformation />
      </div>
    </main>
  );
}

function Login({ onLogin, onCancel }: { onLogin: (token: string) => void; onCancel: () => void }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function login() {
    setChecking(true);
    setError('');
    try {
      await validateAdminSession(token);
      onLogin(token);
    } catch {
      setError('Неверный ключ доступа. Проверьте его и попробуйте ещё раз.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#edf0f2] p-5 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
        <ShieldCheck className="h-10 w-10 text-[#8b3034]" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Админ-панель</h1>
        <p className="mt-2 text-gray-600">Введите локальный ключ доступа. В рабочей версии здесь будет отдельная защищённая учётная запись.</p>
        <label className="mt-6 block">
          <span className="text-sm font-bold text-gray-700">Ключ доступа</span>
          <input type="password" value={token} onChange={event => setToken(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') void login(); }} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#8b3034]" />
        </label>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button onClick={() => void login()} disabled={!token || checking} className="mt-5 w-full rounded-xl bg-[#8b3034] py-3 font-bold text-white disabled:opacity-40">{checking ? 'Проверяем…' : 'Войти'}</button>
        <button onClick={onCancel} className="mt-3 w-full py-2 text-gray-600">Вернуться к форме</button>
      </section>
    </main>
  );
}

function AdminPanel({ token, onLogout, onPublic }: { token: string; onLogout: () => void; onPublic: () => void }) {
  const [notes, setNotes] = useState<ChurchNote[]>([]);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ChurchNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const result = await listNotes(token, filter || undefined);
      setNotes(result.notes);
      if (selected) setSelected(result.notes.find(note => note.id === selected.id) ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, [filter]);
  const visible = useMemo(() => notes.filter(note => `${note.id} ${note.senderName} ${note.treba} ${note.names.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [notes, query]);
  const counts = useMemo(() => ({ all: notes.length, paid: notes.filter(note => note.status === 'paid').length, pending: notes.filter(note => note.status === 'pending_payment').length }), [notes]);

  async function updateStatus(note: ChurchNote, status: NoteStatus) {
    try {
      const result = await changeNoteStatus(token, note, status);
      setSelected(result.note);
      await refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Ошибка статуса');
    }
  }

  async function printNote(note: ChurchNote) {
    try {
      const result = await getPrintDocument(token, note);
      setSelected(result.note);
      setNotes(current => current.map(item => item.id === result.note.id ? result.note : item));
      const windowRef = window.open('', '_blank', 'width=720,height=900');
      if (!windowRef) throw new Error('Браузер заблокировал окно печати');
      const escaped = result.printDocument.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      windowRef.document.write(`<html><head><title>${note.id}</title><style>body{font-family:Georgia,serif;padding:48px;white-space:pre-wrap;font-size:20px;line-height:1.6}</style></head><body>${escaped}<script>window.print()</script></body></html>`);
      windowRef.document.close();
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : 'Ошибка печати');
    }
  }

  return (
    <main className="min-h-screen bg-[#edf0f2] text-gray-900">
      <header className="border-b border-gray-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#8b3034]">Hram Admin</div>
            <h1 className="text-xl font-bold">Очередь церковных записок</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={onPublic} className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold">Форма</button>
            <button onClick={onLogout} className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-bold text-white"><LogOut className="mr-2 inline h-4 w-4" />Выйти</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-5">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ['Всего', counts.all, FileText],
            ['Ожидают оплаты', counts.pending, Clock3],
            ['Оплачены', counts.paid, WalletCards],
          ].map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-[#8b3034]" />
              <div className="mt-3 text-3xl font-bold">{String(value)}</div>
              <div className="text-sm text-gray-600">{String(label)}</div>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Поиск по имени, требе или номеру" className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-[#8b3034]" />
            </label>
            <select value={filter} onChange={event => setFilter(event.target.value)} className="rounded-xl border border-gray-200 px-4 py-3">
              <option value="">Все статусы</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button onClick={() => void refresh()} className="rounded-xl border border-gray-200 px-4 py-3 font-bold"><RefreshCw className="mr-2 inline h-4 w-4" />Обновить</button>
          </div>
        </section>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-100 p-3 text-red-800">{error}</p>}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 font-bold">Записки</div>
            {loading ? <p className="p-5 text-gray-500">Загрузка…</p> : visible.length === 0 ? <p className="p-5 text-gray-500">Записок пока нет</p> : visible.map(note => (
              <button key={note.id} onClick={() => setSelected(note)} className={`block w-full border-b border-gray-100 p-5 text-left hover:bg-[#faf7f2] ${selected?.id === note.id ? 'bg-[#f7efe8]' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{note.treba} · {note.type === 'zdravie' ? 'о здравии' : 'об упокоении'}</div>
                    <div className="mt-1 text-sm text-gray-600">{note.names.length} имён · {note.amount} {note.currency}</div>
                    <div className="mt-1 text-xs text-gray-400">{note.id}</div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">{statusLabels[note.status]}</span>
                </div>
              </button>
            ))}
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start">
            {!selected ? <p className="text-gray-500">Выберите записку слева</p> : (
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{selected.treba}</h2>
                    <p className="text-sm text-gray-500">{selected.id}</p>
                  </div>
                  <span className="rounded-full bg-[#f1ece3] px-3 py-1 text-xs font-bold text-[#8b3034]">{statusLabels[selected.status]}</span>
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div><dt className="text-gray-500">Отправитель</dt><dd className="font-bold">{selected.senderName}</dd></div>
                  <div><dt className="text-gray-500">Сумма</dt><dd className="font-bold">{selected.amount} {selected.currency}</dd></div>
                  <div><dt className="text-gray-500">Имена</dt><dd className="mt-2 rounded-xl bg-[#f7f4ef] p-4 leading-7">{selected.names.map((name, index) => <div key={index}>{index + 1}. {name}</div>)}</dd></div>
                </dl>
                <button onClick={() => void printNote(selected)} className="mt-5 w-full rounded-xl bg-gray-900 py-3 font-bold text-white"><Printer className="mr-2 inline h-5 w-5" />Распечатать</button>
                {selected.status === 'paid' && <button onClick={() => void updateStatus(selected, 'completed')} className="mt-3 w-full rounded-xl bg-[#8b3034] py-3 font-bold text-white">Отметить обработанной</button>}
                {selected.status === 'printing' && <button onClick={() => void updateStatus(selected, 'completed')} className="mt-3 w-full rounded-xl bg-[#8b3034] py-3 font-bold text-white">Завершить</button>}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const initialPath = window.location.pathname;
  const [route, setRoute] = useState(initialPath.startsWith('/admin') ? 'admin-login' : 'public');
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('hram-admin-token') ?? '');

  useEffect(() => {
    if (initialPath.startsWith('/admin') && adminToken) setRoute('admin');
  }, []);

  if (route === 'admin-login') {
    return <Login onCancel={() => setRoute('public')} onLogin={token => { sessionStorage.setItem('hram-admin-token', token); setAdminToken(token); setRoute('admin'); }} />;
  }
  if (route === 'admin') {
    return <AdminPanel token={adminToken} onPublic={() => setRoute('public')} onLogout={() => { sessionStorage.removeItem('hram-admin-token'); setAdminToken(''); setRoute('admin-login'); }} />;
  }
  return <PublicForm onOpenAdmin={() => setRoute(adminToken ? 'admin' : 'admin-login')} />;
}
