import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import headerChapel from './assets/header-chapel.jpg';
import crossSymbol from './assets/cross-celtic.png';
import akafistKrest from './assets/akafist-krest.jpg';
import akafistMlekopitatelnitsa from './assets/akafist-mlekopitatelnitsa.jpg';

const LogoSeal = () => (
  <div className="flex items-center justify-center mb-8 mt-2 gap-[14px]">
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <img
      src={crossSymbol}
      alt="Кельтский крест"
      className="mx-2 w-[72px] h-[72px] object-contain"
    />
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
  </div>
);

const IntroText = () => (
  <div className="px-6 py-10 text-[15.5px] leading-[1.6] space-y-6 text-gray-800 bg-[#fcfaf5]">
    <div className="flex items-start gap-4">
      <div className="w-[32px] h-[32px] rounded-full border-[2.5px] border-[#942e39] text-[#942e39] flex items-center justify-center font-bold text-xl shrink-0 mt-0.5">
        !
      </div>
      <p className="text-[#942e39] font-medium text-[16px] leading-snug">
        Обращаем ваше внимание, что за самоубийц не совершается церковное
        поминовение об упокоении, кроме как по благословению архиерея.
      </p>
    </div>

    <p>
      Мы принимаем записки о здравии и об упокоении, а также вы можете заказать
      сорокоуст, молебен, акафист, обедню и другие требы. Записки на пост
      принимаются только во время Рождественского и Великого поста.
    </p>
    <p>
      Подавая записку за христианина католического вероисповедания либо за
      некрещеного, обязательно указывайте это в записке рядом с именем.
    </p>

    <p className="mb-2">
      В случае возникновения вопросов обращайтесь в службу технической
      поддержки по электронной почте:
      <br />
      <a href="mailto:Alexbelskid@gmail.com" className="text-[#942e39]">
        Alexbelskid@gmail.com
      </a>
    </p>
  </div>
);

const SiteInformation = () => (
  <section className="bg-[#f4efe7] px-6 py-10 text-gray-800" aria-labelledby="site-information-title">
    <h2
      id="site-information-title"
      className="text-center text-[#8b3034] text-[25px] font-bold uppercase tracking-wide"
    >
      Информация об услугах и оплате
    </h2>
    <p className="mt-3 text-center text-[16px] leading-[1.6] text-gray-600">
      Сайт проходит подготовку к подключению онлайн-платежей. Сейчас банковские
      карты и платёжные данные на этой странице не принимаются.
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
          className="min-h-[48px] rounded-xl border border-[#cdbdb0] bg-[#fcfaf5] px-3 py-3 text-center text-[16px] font-bold text-[#8b3034] flex items-center justify-center"
        >
          {label}
        </a>
      ))}
    </nav>

    <div className="mt-8 space-y-5">
      <article id="services" className="rounded-2xl bg-[#fcfaf5] p-5 shadow-sm scroll-mt-4">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <FileText className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Оказываемые услуги</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          На сайте можно подготовить церковную записку о здравии или об
          упокоении и выбрать требу: Проскомидию, Обедню, Молебен, Панихиду,
          Акафист или Сорокоуст. Итоговая сумма пожертвования показывается до
          подтверждения формы и зависит от выбранной требы и количества имён.
        </p>
      </article>

      <article id="payment" className="rounded-2xl bg-[#fcfaf5] p-5 shadow-sm scroll-mt-4">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <ShieldCheck className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Оплата и безопасность</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          Онлайн-оплата пока не подключена. Сайт не запрашивает номер карты,
          срок её действия или CVC/CVV-код. После заключения договора с
          платёжным провайдером здесь будут опубликованы поддерживаемые способы
          оплаты, правила проведения платежа и официальные логотипы платёжных
          систем.
        </p>
      </article>

      <article id="refund" className="rounded-2xl bg-[#fcfaf5] p-5 shadow-sm scroll-mt-4">
        <div className="flex items-center gap-3 text-[#8b3034]">
          <RotateCcw className="h-6 w-6 shrink-0" />
          <h3 className="text-[20px] font-bold">Отмена и возврат</h3>
        </div>
        <p className="mt-3 text-[16px] leading-[1.65]">
          До подключения платежей возврат через сайт не производится, поскольку
          сайт не принимает деньги. Окончательный порядок отмены записки и
          возврата платежа будет опубликован после его утверждения организацией
          и согласования с платёжным провайдером.
        </p>
      </article>

      <article id="details" className="rounded-2xl bg-[#fcfaf5] p-5 shadow-sm scroll-mt-4">
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
            <dd className="text-gray-600">
              Будут опубликованы после получения и проверки официальных данных.
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
);

const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="min-h-screen bg-[#8b97a2] font-sans flex justify-center w-full">
    <div className="w-full max-w-[480px] bg-[#8b97a2] shadow-2xl relative">
      <div className="bg-[#fcfaf5] min-h-screen px-6 py-12 flex flex-col items-center justify-center text-center">
        <img
          src={crossSymbol}
          alt="Кельтский крест"
          className="w-[84px] h-[84px] object-contain mb-6"
        />
        <div className="w-16 h-16 rounded-full bg-[#8b3034] flex items-center justify-center shadow-md mb-6">
          <CheckCircle2 className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-[#8b3034] text-[28px] font-bold uppercase tracking-wide mb-4">
          Черновик сформирован
        </h1>
        <p className="text-gray-700 text-[17px] leading-[1.6] max-w-[320px] mb-8">
          Это демонстрационная версия: данные не отправлены в храм, а оплата не
          выполнялась. После подключения приёма записок здесь появится
          подтверждение фактической отправки.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="w-full max-w-[320px] bg-[#8b3034] text-white rounded-[16px] py-[18px] text-[20px] uppercase font-bold shadow-xl tracking-wide"
        >
          Создать другой черновик
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const TREBAS = [
    'Проскомидия',
    'Обедня',
    'Молебен',
    'Панихида',
    'Акафист',
    'Сорокоуст',
  ];

  const [treba, setTreba] = useState<string>('Выберите требу');
  const [names, setNames] = useState<string[]>(Array(10).fill(''));
  const [type, setType] = useState<'zdravie' | 'upokoenie'>('zdravie');
  const [duration, setDuration] = useState<string>('40 дней');
  const [akafistTarget, setAkafistTarget] = useState<string>('Христу');
  const [senderName, setSenderName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isTrebaSelected = treba !== 'Выберите требу';
  const showDuration = treba === 'Сорокоуст';
  const showAkafistTargets = treba === 'Акафист';
  const canChooseUpokoenie = !['Молебен', 'Акафист'].includes(treba);
  const filledNamesCount = names.filter(name => name.trim() !== '').length;

  const perNotePrices: Record<string, number> = {
    Проскомидия: 3,
    Обедня: 8,
    Молебен: 5,
    Панихида: 5,
    Акафист: 8,
  };

  const notePrice = perNotePrices[treba] ?? 0;
  const donationAmount =
    treba === 'Сорокоуст' && filledNamesCount > 0
      ? filledNamesCount * 10
      : notePrice > 0 && filledNamesCount > 0
        ? Math.ceil(filledNamesCount / 12) * notePrice
        : 0;

  const donationHint =
    !isTrebaSelected
      ? 'Выберите требу, чтобы увидеть сумму пожертвования.'
      : treba === 'Сорокоуст'
        ? 'Для Сорокоуста одно имя стоит 10 BYN.'
        : notePrice > 0
          ? `Для требы «${treba}» одна записка до 12 имен стоит ${notePrice} BYN. Если имен больше 12, считается следующая записка и сумма увеличивается еще на ${notePrice} BYN.`
          : 'Выберите требу, чтобы увидеть сумму пожертвования.';

  const handleSubmit = () => {
    if (!isTrebaSelected || filledNamesCount === 0 || senderName.trim() === '') {
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setTreba('Выберите требу');
    setNames(Array(10).fill(''));
    setType('zdravie');
    setDuration('40 дней');
    setAkafistTarget('Христу');
    setSenderName('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <SuccessScreen onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-[#8b97a2] font-sans flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-[#8b97a2] shadow-2xl relative">
        <div className="bg-[#fcfaf5] rounded-b-[32px] pb-[44px] shadow-sm">
          <div className="w-full h-[240px] relative bg-gray-200 flex items-center justify-center">
            <img
              src={headerChapel}
              alt="Часовня внутри храма"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 text-center px-4">
              <div className="inline-flex rounded-full bg-[#fcfaf5] px-4 py-2 text-[14px] font-bold uppercase tracking-wide text-[#8b3034] shadow-md">
                Демонстрационная версия
              </div>
              <h1 className="mt-4 text-white text-[32px] font-bold uppercase tracking-widest">
                Макет церковной записки
              </h1>
            </div>
          </div>

          <LogoSeal />

          <div className="px-6 mt-2">
            <div className="relative mb-10">
              <select
                value={treba}
                onChange={e => {
                  const value = e.target.value;
                  setTreba(value);

                  if (value === 'Панихида') {
                    setType('upokoenie');
                  } else if (value === 'Молебен' || value === 'Акафист') {
                    setType('zdravie');
                  }
                  if (value !== 'Сорокоуст') {
                    setDuration('40 дней');
                  }
                  if (value !== 'Акафист') {
                    setAkafistTarget('Христу');
                  }
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              >
                <option value="Выберите требу" disabled>
                  Выберите требу
                </option>
                {TREBAS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div className="border-[1.5px] border-[#8b3034] text-[#8b3034] rounded-full py-[14px] px-6 flex justify-center items-center bg-[#fcfaf5] pointer-events-none relative shadow-sm">
                <span className="text-[22px] uppercase font-bold tracking-tight">
                  {treba === 'Выберите требу' ? 'ВЫБЕРИТЕ ТРЕБУ' : treba}
                </span>
                <div className="absolute right-[14px] w-[34px] h-[34px] rounded-full border-[1.5px] border-[#8b3034] flex items-center justify-center bg-[#fcfaf5]">
                  <ChevronDown className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="mb-10 space-y-[14px]">
              {isTrebaSelected && (
                <>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setType('zdravie')}
                      className={`flex justify-center items-center py-[16px] rounded-[14px] border-2 transition-all ${
                        treba === 'Панихида' || !canChooseUpokoenie ? 'w-full' : 'flex-1'
                      } ${
                        type === 'zdravie'
                          ? 'bg-[#d24c58] border-[#d24c58] text-white shadow-md font-medium'
                          : 'bg-[#fcfaf5] border-[#d24c58] text-[#d24c58] font-medium'
                      }`}
                    >
                      {type === 'zdravie' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                      <span className="ml-[8px] text-[17px]">о здравии</span>
                    </button>

                    {canChooseUpokoenie && (
                      <button
                        type="button"
                        onClick={() => setType('upokoenie')}
                        className={`flex justify-center items-center py-[16px] rounded-[14px] border-2 transition-all ${
                          treba === 'Панихида' ? 'w-full' : 'flex-1'
                        } ${
                          type === 'upokoenie'
                            ? 'bg-[#40434f] border-[#40434f] text-white shadow-md font-medium'
                            : 'bg-[#fcfaf5] border-[#40434f] text-[#40434f] font-medium'
                        }`}
                      >
                        {type === 'upokoenie' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                        <span className="ml-[8px] text-[17px]">об упокоении</span>
                      </button>
                    )}
                  </div>

                  {showDuration && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {['40 дней'].map(d => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex items-center flex-1 min-w-[100px] justify-center py-[16px] rounded-[14px] border-[1.5px] transition-all ${
                            duration === d
                              ? 'bg-white border-[#8faad9] text-[#333] shadow-sm font-medium'
                              : 'bg-[#fcfaf5] border-[#dfd6cb] text-gray-400 font-medium'
                          }`}
                        >
                          {duration === d ? (
                            <CheckCircle2 className="w-6 h-6 mr-2 text-[#8faad9] stroke-[2.5]" />
                          ) : (
                            <Circle className="w-6 h-6 mr-2 text-[#dfd6cb]" />
                          )}
                          <span className="text-[17px]">{d}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {showAkafistTargets && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-2">
                      {[
                        {
                          value: 'Христу',
                          label: 'Честному и Животворящему Кресту Господню',
                          image: akafistKrest,
                        },
                        {
                          value: 'Млекопитательница',
                          label: 'Божией Матери «Млекопитательница»',
                          image: akafistMlekopitatelnitsa,
                        },
                      ].map(option => {
                        const selected = akafistTarget === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setAkafistTarget(option.value)}
                            className="flex flex-col items-center text-center"
                          >
                            <div className="relative">
                              <div className="w-[132px] h-[132px] rounded-full border-[3px] border-[#8b3034] bg-white overflow-hidden shadow-sm">
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute left-0 bottom-1 w-9 h-9 rounded-full bg-white border-2 border-[#8b3034] flex items-center justify-center shadow-sm">
                                {selected ? (
                                  <CheckCircle2 className="w-7 h-7 text-[#8b3034] fill-white" />
                                ) : (
                                  <Circle className="w-6 h-6 text-[#8b3034]" />
                                )}
                              </div>
                            </div>
                            <span className="mt-3 text-[14px] leading-[1.3] text-[#8b3034] font-medium max-w-[160px]">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-[18px]">
              {names.map((name, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <span className="text-[#8b3034] font-medium text-[19px] min-w-[24px] text-right pb-[2px]">
                    {idx + 1}.
                  </span>
                  <input
                    className="flex-1 pb-[6px] px-1 border-b-[1.5px] border-[#8b3034] bg-transparent outline-none italic placeholder:text-gray-400 text-gray-700 text-[17px]"
                    placeholder="Добавьте ИМЯ в родительном падеже"
                    value={name}
                    onChange={e => {
                      const arr = [...names];
                      arr[idx] = e.target.value;
                      setNames(arr);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setNames([...names, ''])}
                className="bg-[#c2b6a5] text-white px-8 py-[14px] rounded-xl font-medium text-[18px] shadow-sm tracking-wide"
              >
                Добавить еще имя
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-10 flex flex-col gap-10">
          <input
            className="w-full bg-[#fdfaf5] rounded-[14px] px-5 py-[18px] italic text-[#666] outline-none text-[18px] placeholder:text-gray-400 font-medium shadow-sm"
            placeholder="Ваше имя"
            value={senderName}
            onChange={e => setSenderName(e.target.value)}
          />

          <div className="text-center text-white">
            <div className="text-[20px] font-bold">Расчёт рекомендуемого пожертвования</div>
            <div className="mt-2 text-[14px] leading-snug opacity-90">
              Демонстрационный расчёт. Оплата на сайте не производится.
            </div>
          </div>

          <div className="flex gap-[14px]">
            <div className="flex-1 bg-[#a2aab2] text-[#697481] rounded-[14px] py-[16px] text-center font-bold text-[28px] shadow-inner select-none tracking-wider">
              {donationAmount}
            </div>
            <div className="flex-1 bg-[#fcfaf5] text-[#8b3034] rounded-[14px] py-[16px] text-center font-bold text-[28px] shadow-sm select-none tracking-wider">
              BYN
            </div>
          </div>

          {isTrebaSelected && (
            <p className="text-[#fcfaf5] text-[14px] leading-snug text-center -mt-4 px-1">
              {donationHint}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isTrebaSelected || filledNamesCount === 0 || senderName.trim() === ''}
            className={`w-full rounded-[16px] py-[22px] text-[24px] uppercase font-bold shadow-xl flex justify-center items-center tracking-wide transition-opacity ${
              !isTrebaSelected || filledNamesCount === 0 || senderName.trim() === ''
                ? 'bg-[#d8d2ca] text-[#8e877f] cursor-not-allowed opacity-70'
                : 'bg-[#fcfaf5] text-[#8b3034]'
            }`}
          >
            СФОРМИРОВАТЬ ЧЕРНОВИК
          </button>
        </div>

        <IntroText />
        <SiteInformation />
      </div>
    </div>
  );
}
