import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Circle } from 'lucide-react';
import headerChurch from './assets/header-church.jpg';
import crossSymbol from './assets/cross-symbol.png';

const LogoSeal = () => (
  <div className="flex items-center justify-center mb-8 mt-2 gap-[14px]">
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <img
      src={crossSymbol}
      alt="Крест"
      className="mx-2 w-[56px] h-[56px] object-contain"
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
      поддержки по электронной почте:<br />
      <a href="mailto:Alexbelskid@gmail.com" className="text-[#942e39]">
        Alexbelskid@gmail.com
      </a>
    </p>
  </div>
);

export default function App() {
  const TREBAS = [
    "Проскомидия",
    "Обедня",
    "Молебен",
    "Панихида",
    "Акафист",
    "Сорокоуст",
  ];

  const [treba, setTreba] = useState<string>("Выберите требу");
  const [names, setNames] = useState<string[]>(Array(10).fill(""));
  const [type, setType] = useState<"zdravie" | "upokoenie">("zdravie");
  const [duration, setDuration] = useState<string>("40 дней");
  const showDuration = treba === 'Сорокоуст';
  const filledNamesCount = names.filter(name => name.trim() !== '').length;
  const donationAmount =
    treba === 'Проскомидия' && filledNamesCount > 0
      ? Math.ceil(filledNamesCount / 12) * 3
      : treba === 'Обедня' && filledNamesCount > 0
        ? Math.ceil(filledNamesCount / 12) * 8
        : 0;
  const donationHint =
    treba === 'Проскомидия'
      ? 'Для Проскомидии одна записка до 12 имен стоит 3 BYN. Если имен больше 12, считается следующая записка и сумма увеличивается еще на 3 BYN.'
      : treba === 'Обедня'
        ? 'Для Обедни одна записка до 12 имен стоит 8 BYN. Если имен больше 12, считается следующая записка и сумма увеличивается еще на 8 BYN.'
        : 'Выберите требу, чтобы увидеть сумму пожертвования.';

  return (
    <div className="min-h-screen bg-[#8b97a2] font-sans flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-[#8b97a2] shadow-2xl relative">
        
        {/* Main White Card top section */}
        <div className="bg-[#fcfaf5] rounded-b-[32px] pb-[44px] shadow-sm">
          {/* Header Image */}
          <div className="w-full h-[240px] relative bg-gray-200 flex items-center justify-center">
            <img 
              src={headerChurch}
              alt="Интерьер храма"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <h1 className="relative z-10 text-white text-[32px] font-bold uppercase tracking-widest text-center px-4">
              Подать записку
            </h1>
          </div>

          <LogoSeal />

          {/* Form Content inside white card */}
          <div className="px-6 mt-2">
            
            {/* Treba Select */}
            <div className="relative mb-10">
              <select 
                value={treba}
                onChange={e => {
                  const value = e.target.value;
                  setTreba(value);
                  if (value === 'Панихида') {
                    setType('upokoenie');
                  }
                  if (value !== 'Сорокоуст') {
                    setDuration('40 дней');
                  }
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              >
                <option value="Выберите требу" disabled>Выберите требу</option>
                {TREBAS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="border-[1.5px] border-[#8b3034] text-[#8b3034] rounded-full py-[14px] px-6 flex justify-center items-center bg-[#fcfaf5] pointer-events-none relative shadow-sm">
                <span className="text-[22px] uppercase font-bold tracking-tight">
                  {treba === "Выберите требу" ? "ВЫБЕРИТЕ ТРЕБУ" : treba}
                </span>
                <div className="absolute right-[14px] w-[34px] h-[34px] rounded-full border-[1.5px] border-[#8b3034] flex items-center justify-center bg-[#fcfaf5]">
                  <ChevronDown className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Extra options */}
            <div className="mb-10 space-y-[14px]">
              <p className="text-[#a54c52] text-[13px] leading-tight mt-1 px-1">
                {donationHint}
              </p>

              <div className="flex gap-3 pt-2">
                {treba !== 'Панихида' && (
                  <button 
                    onClick={() => setType('zdravie')} 
                    className={`flex-1 flex justify-center items-center py-[16px] rounded-[14px] border-2 transition-all ${
                      type === 'zdravie' 
                        ? 'bg-[#d24c58] border-[#d24c58] text-white shadow-md font-medium' 
                        : 'bg-[#fcfaf5] border-[#d24c58] text-[#d24c58] font-medium'
                    }`}
                  >
                    {type === 'zdravie' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    <span className="ml-[8px] text-[17px]">о здравии</span>
                  </button>
                )}
                <button 
                  onClick={() => setType('upokoenie')} 
                  className={`flex justify-center items-center py-[16px] rounded-[14px] border-2 transition-all ${
                    treba === 'Панихида' ? 'w-full' : 'flex-1'
                  } ${
                    type === 'upokoenie' 
                      ? 'bg-[#40434f] border-[#40434f] text-white shadow-md font-medium' 
                      : 'bg-[#fcfaf5] border-[#40434f] text-[#40434f] font-medium'
                  }`}
                >
                  {type === 'upokoenie' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  <span className="ml-[8px] text-[17px]">об упокоении</span>
                </button>
              </div>

              {showDuration && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {['40 дней', '6 месяцев', '1 год'].map(d => (
                    <button 
                      key={d} 
                      onClick={() => setDuration(d)} 
                      className={`flex items-center flex-1 min-w-[100px] justify-center py-[16px] rounded-[14px] border-[1.5px] transition-all ${
                        duration === d 
                          ? 'bg-white border-[#8faad9] text-[#333] shadow-sm font-medium' 
                          : 'bg-[#fcfaf5] border-[#dfd6cb] text-gray-400 font-medium'
                      }`}
                    >
                      {duration === d ? <CheckCircle2 className="w-6 h-6 mr-2 text-[#8faad9] stroke-[2.5]" /> : <Circle className="w-6 h-6 mr-2 text-[#dfd6cb]" />}
                      <span className="text-[17px]">{d}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Names Input List */}
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
                onClick={() => setNames([...names, ""])}
                className="bg-[#c2b6a5] text-white px-8 py-[14px] rounded-xl font-medium text-[18px] shadow-sm tracking-wide"
              >
                Добавить еще имя
              </button>
            </div>
            
          </div>
        </div>

        {/* Bottom Slate Form */}
        <div className="px-6 py-10 flex flex-col gap-10">
          <input 
            className="w-full bg-[#fdfaf5] rounded-[14px] px-5 py-[18px] italic text-[#666] outline-none text-[18px] placeholder:text-gray-400 font-medium shadow-sm" 
            placeholder="Ваше имя" 
          />
          
          <div className="text-center italic text-white text-[20px] font-light">
            Общая сумма пожертвования:
          </div>

          <div className="flex gap-[14px]">
            <div className="flex-1 bg-[#a2aab2] text-[#697481] rounded-[14px] py-[16px] text-center font-bold text-[28px] shadow-inner select-none tracking-wider">
              {donationAmount}
            </div>
            <div className="flex-1 bg-[#fcfaf5] text-[#8b3034] rounded-[14px] py-[16px] text-center font-bold text-[28px] shadow-sm select-none tracking-wider">
              BYN
            </div>
          </div>

          <button className="w-full bg-[#fcfaf5] text-[#8b3034] rounded-[16px] py-[22px] text-[24px] uppercase font-bold shadow-xl flex justify-center items-center tracking-wide">
            ПОДАТЬ ЗАПИСКУ
          </button>
        </div>
        
        <IntroText />
      </div>
    </div>
  );
}

