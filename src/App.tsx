import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Circle } from 'lucide-react';

const LogoSeal = () => (
  <div className="flex items-center justify-center mb-8 mt-2 gap-[14px]">
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <div className="w-[6px] h-[6px] rotate-45 bg-[#8b3034]"></div>
    <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
      <circle cx="50" cy="50" r="48" stroke="#8b3034" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" stroke="#8b3034" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M50 20 L50 80 M25 35 L75 35 M32 65 L68 53" stroke="#8b3034" strokeWidth="4" />
      <text x="26" y="55" fill="#8b3034" fontSize="13" fontWeight="800" fontFamily="sans-serif">NI</text>
      <text x="59" y="55" fill="#8b3034" fontSize="13" fontWeight="800" fontFamily="sans-serif">KA</text>
    </svg>
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
      неусыпаемую псалтирь, сорокоуст, молебен, акафист, обедню и другие требы.
      Записки на пост принимаются только во время Рождественского и Великого
      поста.
    </p>
    <p>
      За христиан католического вероисповедания можно заказывать только
      неусыпаемую псалтирь, за некрещеных — только канон мученику Уару. Подавая
      записку за христианина католического вероисповедания либо за некрещеного,
      обязательно указывайте это в записке рядом с именем.
    </p>

    <p>
      Дорогие друзья! Благодарим вас за пожертвование. Мы получаем все ваши
      электронные записки! На указанную вами почту придет уведомление от сайта
      монастыря и от системы webpay. Если вы отправили пожертвование до 16:00 —
      записка будет подана на следующий день, если после 16:00 — то через день.
    </p>

    <p className="mb-2">
      В случае возникновения вопросов обращайтесь в службу технической
      поддержки по электронной почте:<br />
      <a href="mailto:e.masurnovskaya@obitel-minsk.by" className="text-[#942e39]">
        e.masurnovskaya@obitel-minsk.by
      </a>
    </p>
  </div>
);

export default function App() {
  const TREBAS = [
    "Обедня",
    "Молебен",
    "Панихида",
    "Акафист",
  ];

  const [treba, setTreba] = useState<string>("Выберите требу");
  const [names, setNames] = useState<string[]>(Array(10).fill(""));
  const [type, setType] = useState<"zdravie" | "upokoenie">("zdravie");
  const [duration, setDuration] = useState<string>("40 дней");

  return (
    <div className="min-h-screen bg-[#8b97a2] font-sans flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-[#8b97a2] shadow-2xl relative">
        
        {/* Main White Card top section */}
        <div className="bg-[#fcfaf5] rounded-b-[32px] pb-[44px] shadow-sm">
          {/* Header Image */}
          <div className="w-full h-[240px] relative bg-gray-200 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1548625361-b552bb7db2ff?auto=format&fit=crop&w=1000&q=80" 
              alt="Крестный ход" 
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
                onChange={e => setTreba(e.target.value)}
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
                Размер пожертвования указан за одно имя. При добавлении имен размер пожертвования будет увеличен.
              </p>

              <div className="flex gap-3 pt-2">
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
                <button 
                  onClick={() => setType('upokoenie')} 
                  className={`flex-1 flex justify-center items-center py-[16px] rounded-[14px] border-2 transition-all ${
                    type === 'upokoenie' 
                      ? 'bg-[#40434f] border-[#40434f] text-white shadow-md font-medium' 
                      : 'bg-[#fcfaf5] border-[#40434f] text-[#40434f] font-medium'
                  }`}
                >
                  {type === 'upokoenie' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  <span className="ml-[8px] text-[17px]">об упокоении</span>
                </button>
              </div>

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
              0
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

