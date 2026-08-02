/* ============ 外语学习：韩语 + 日语 ============ */
/* ---- 韩语四十音 ---- */
const KR_CONS = [
  ['ㄱ', 'g', '哥'], ['ㄴ', 'n', '呢'], ['ㄷ', 'd', '的'], ['ㄹ', 'l/r', '了'], ['ㅁ', 'm', '摸'],
  ['ㅂ', 'b', '波'], ['ㅅ', 's', '四'], ['ㅇ', 'ng', '嗯(零声母)'], ['ㅈ', 'j', '几'], ['ㅊ', 'ch', '拆'],
  ['ㅋ', 'k', '柯'], ['ㅌ', 't', '特'], ['ㅍ', 'p', '婆'], ['ㅎ', 'h', '喝'], ['ㄲ', 'kk', '哥(紧)'],
  ['ㄸ', 'tt', '的(紧)'], ['ㅃ', 'pp', '波(紧)'], ['ㅆ', 'ss', '四(紧)'], ['ㅉ', 'jj', '几(紧)']
];
const KR_VOW = [
  ['ㅏ', 'a', '啊'], ['ㅑ', 'ya', '呀'], ['ㅓ', 'eo', '哦'], ['ㅕ', 'yeo', '夭'], ['ㅗ', 'o', '奥'],
  ['ㅛ', 'yo', '哟'], ['ㅜ', 'u', '乌'], ['ㅠ', 'yu', '游'], ['ㅡ', 'eu', '呃'], ['ㅣ', 'i', '衣'],
  ['ㅐ', 'ae', '哎'], ['ㅒ', 'yae', '耶'], ['ㅔ', 'e', '诶'], ['ㅖ', 'ye', '耶'], ['ㅘ', 'wa', '哇'],
  ['ㅙ', 'wae', '外'], ['ㅚ', 'oe', '危'], ['ㅝ', 'wo', '窝'], ['ㅞ', 'we', '威'], ['ㅟ', 'wi', '威'], ['ㅢ', 'ui', '危']
];
/* ---- 日语五十音（清音 + 浊音/半浊 + 拗音） ---- */
const JP_GOJUON = [
  ['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o'],
  ['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko'],
  ['さ', 'sa'], ['し', 'shi'], ['す', 'su'], ['せ', 'se'], ['そ', 'so'],
  ['た', 'ta'], ['ち', 'chi'], ['つ', 'tsu'], ['て', 'te'], ['と', 'to'],
  ['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no'],
  ['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu'], ['へ', 'he'], ['ほ', 'ho'],
  ['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo'],
  ['や', 'ya'], ['ゆ', 'yu'], ['よ', 'yo'],
  ['ら', 'ra'], ['り', 'ri'], ['る', 'ru'], ['れ', 're'], ['ろ', 'ro'],
  ['わ', 'wa'], ['を', 'wo'], ['ん', 'n']
];
const JP_DAKUON = [
  ['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go'],
  ['ざ', 'za'], ['じ', 'ji'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo'],
  ['だ', 'da'], ['ぢ', 'ji'], ['づ', 'zu'], ['で', 'de'], ['ど', 'do'],
  ['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo'],
  ['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po']
];
const JP_YOON = [
  ['きゃ', 'kya'], ['きゅ', 'kyu'], ['きょ', 'kyo'],
  ['しゃ', 'sha'], ['しゅ', 'shu'], ['しょ', 'sho'],
  ['ちゃ', 'cha'], ['ちゅ', 'chu'], ['ちょ', 'cho'],
  ['にゃ', 'nya'], ['にゅ', 'nyu'], ['にょ', 'nyo'],
  ['りゃ', 'rya'], ['りゅ', 'ryu'], ['りょ', 'ryo'],
  ['ぎゃ', 'gya'], ['ぎゅ', 'gyu'], ['ぎょ', 'gyo'],
  ['びゃ', 'bya'], ['びゅ', 'byu'], ['びょ', 'byo'],
  ['ぴゃ', 'pya'], ['ぴゅ', 'pyu'], ['ぴょ', 'pyo'],
  ['じゃ', 'ja'], ['じゅ', 'ju'], ['じょ', 'jo']
];
/* ---- 韩语日常问候（分级） ---- */
const KR_GREET = [
  /* 初级 */
  { w: '안녕하세요', ph: 'an-nyeong-ha-se-yo', mean: '你好', level: '初级', ex: [{ ko: '안녕하세요, 반갑습니다.', zh: '你好，很高兴认识你。' }, { ko: '안녕하세요, 잘 지내세요?', zh: '你好，最近过得好吗？' }] },
  { w: '감사합니다', ph: 'gam-sa-ham-ni-da', mean: '谢谢', level: '初级', ex: [{ ko: '도와주셔서 감사합니다.', zh: '谢谢你帮忙。' }, { ko: '정말 감사합니다.', zh: '真的很感谢。' }] },
  { w: '미안합니다', ph: 'mi-an-ham-ni-da', mean: '对不起', level: '初级', ex: [{ ko: '늦어서 미안합니다.', zh: '迟到了，对不起。' }, { ko: '제가 실수했어요, 미안해요.', zh: '我搞错了，抱歉。' }] },
  { w: '사랑해요', ph: 'sa-rang-hae-yo', mean: '我爱你', level: '初级', ex: [{ ko: '당신을 사랑해요.', zh: '我爱你。' }, { ko: '가족을 사랑해요.', zh: '我爱家人。' }] },
  { w: '밥 먹었어요?', ph: 'bap meo-geo-sseo-yo', mean: '吃饭了吗？', level: '初级', ex: [{ ko: '점심 밥 먹었어요?', zh: '吃午饭了吗？' }, { ko: '맛있게 드세요.', zh: '请慢慢享用。' }] },
  { w: '안녕히 가세요', ph: 'an-nyeong-hi ga-se-yo', mean: '慢走（送别）', level: '初级', ex: [{ ko: '수고하세요, 안녕히 가세요.', zh: '辛苦了，慢走。' }, { ko: '또 만나요, 안녕히 가세요.', zh: '下次见，慢走。' }] },
  { w: '안녕히 계세요', ph: 'an-nyeong-hi gye-se-yo', mean: '留步（告别）', level: '初级', ex: [{ ko: '먼저 갈게요, 안녕히 계세요.', zh: '我先走了，您留步。' }, { ko: '안녕히 계세요, 잘 쉬어요.', zh: '留步，好好休息。' }] },
  { w: '네', ph: 'ne', mean: '是 / 好', level: '初级', ex: [{ ko: '그래요, 네.', zh: '对，是的。' }, { ko: '네, 알겠어요.', zh: '好的，明白了。' }] },
  { w: '아니요', ph: 'a-ni-yo', mean: '不 / 不是', level: '初级', ex: [{ ko: '아니요, 몰라요.', zh: '不，我不知道。' }, { ko: '아니요, 괜찮아요.', zh: '不，没事。' }] },
  { w: '이름이 뭐예요?', ph: 'i-reum-i mwo-ye-yo', mean: '你叫什么名字？', level: '初级', ex: [{ ko: '잠깐, 이름이 뭐예요?', zh: '等等，你叫什么名字？' }, { ko: '반가워요, 이름이 뭐예요?', zh: '很高兴，你叫什么名字？' }] },
  { w: '만나서 반가워요', ph: 'man-na-seo ban-ga-wo-yo', mean: '很高兴认识你', level: '初级', ex: [{ ko: '오래 기다렸어요, 만나서 반가워요.', zh: '等很久了，很高兴认识你。' }, { ko: '친구야, 만나서 반가워요.', zh: '朋友，很高兴认识你。' }] },
  { w: '괜찮아요', ph: 'gwaen-chan-a-yo', mean: '没关系 / 还好', level: '初级', ex: [{ ko: '괜찮아요, 걱정 마세요.', zh: '没关系，别担心。' }, { ko: '아니요, 괜찮아요.', zh: '不，我没事。' }] },
  /* 中级 */
  { w: '잘 자요', ph: 'jal ja-yo', mean: '晚安', level: '中级', ex: [{ ko: '피곤하시죠, 잘 자요.', zh: '累了吧，晚安。' }, { ko: '꿈 꿔요, 잘 자요.', zh: '做个好梦，晚安。' }] },
  { w: '화이팅', ph: 'hwa-i-ting', mean: '加油（应援）', level: '中级', ex: [{ ko: '시험 화이팅!', zh: '考试加油！' }, { ko: '우리 팀 화이팅!', zh: '我们队加油！' }] },
  { w: '어디 가요?', ph: 'eo-di ga-yo', mean: '去哪儿？', level: '中级', ex: [{ ko: '지금 어디 가요?', zh: '现在去哪儿？' }, { ko: '학교에 가요.', zh: '去学校。' }] },
  { w: '시간 있어요?', ph: 'si-gan i-sseo-yo', mean: '有时间吗？', level: '中级', ex: [{ ko: '내일 시간 있어요?', zh: '明天有时间吗？' }, { ko: '잠깐 얘기할래요?', zh: '聊一会儿？' }] },
  { w: '만나서 반갑습니다', ph: 'man-na-seo ban-gap-seum-ni-da', mean: '很高兴见面', level: '中级', ex: [{ ko: '또 만나서 반갑습니다.', zh: '又见面了，很高兴。' }, { ko: '만나서 반갑습니다, 잘 부탁드려요.', zh: '很高兴见面，请多关照。' }] },
  { w: '도와주세요', ph: 'do-wa-ju-se-yo', mean: '请帮帮我', level: '中级', ex: [{ ko: '이것 좀 도와주세요.', zh: '请帮我一下这个。' }, { ko: '계산 좀 도와주세요.', zh: '请帮我算一下。' }] },
  { w: '이해했어요', ph: 'i-hae-hae-seo-yo', mean: '我明白了', level: '中级', ex: [{ ko: '네, 이해했어요.', zh: '嗯，我明白了。' }, { ko: '잘 이해했어요, 감사합니다.', zh: '我理解清楚了，谢谢。' }] },
  { w: '다시 말해 주세요', ph: 'da-si mal-hae ju-se-yo', mean: '请再说一遍', level: '中级', ex: [{ ko: '미안해요, 다시 말해 주세요.', zh: '抱歉，请再说一遍。' }, { ko: '천천히 다시 말해 주세요.', zh: '请慢慢再说一遍。' }] },
  { w: '천천히 말해 주세요', ph: 'cheon-cheon-hi mal-hae ju-se-yo', mean: '请慢慢说', level: '中级', ex: [{ ko: '잘 안 들려요, 천천히 말해 주세요.', zh: '听不清，请慢慢说。' }, { ko: '외국인이라 천천히 말해 주세요.', zh: '我是外国人，请慢点说。' }] },
  { w: '얼마예요?', ph: 'eol-ma-ye-yo', mean: '多少钱？', level: '中级', ex: [{ ko: '이거 얼마예요?', zh: '这个多少钱？' }, { ko: '총 얼마예요?', zh: '一共多少钱？' }] },
  { w: '어디예요?', ph: 'eo-di-ye-yo', mean: '在哪里？', level: '中级', ex: [{ ko: '화장실 어디예요?', zh: '洗手间在哪里？' }, { ko: '지하철 역 어디예요?', zh: '地铁站在哪里？' }] },
  { w: '맛있어요', ph: 'ma-si-sseo-yo', mean: '好吃', level: '中级', ex: [{ ko: '정말 맛있어요!', zh: '真的很好吃！' }, { ko: '한번 드셔보세요, 맛있어요.', zh: '尝尝看，很好吃。' }] },
  /* 高级 */
  { w: '건강하세요', ph: 'geon-gang-ha-se-yo', mean: '请保重身体', level: '高级', ex: [{ ko: '추워지네요, 건강하세요.', zh: '天冷了，请保重。' }, { ko: '바쁘셔도 건강하세요.', zh: '再忙也请保重身体。' }] },
  { w: '성공을 빌어요', ph: 'seong-gong-eul bi-reo-yo', mean: '祝你成功', level: '高级', ex: [{ ko: '새 프로젝트 성공을 빌어요.', zh: '祝新项目成功。' }, { ko: '시험 성공을 빌어요.', zh: '祝考试成功。' }] },
  { w: '생각보다 괜찮아요', ph: 'saeng-gak-bo-da gwaen-chan-a-yo', mean: '比想象中好', level: '高级', ex: [{ ko: '결과가 생각보다 괜찮아요.', zh: '结果比预想的好。' }, { ko: '상황이 생각보다 괜찮아요.', zh: '情况比想象的要好。' }] },
  { w: '마음이 편안해요', ph: 'ma-eu-mi pyeon-an-hae-yo', mean: '心里很平静', level: '高级', ex: [{ ko: '이곳에서 마음이 편안해요.', zh: '在这里心里很安宁。' }, { ko: '음악 듣고 마음이 편안해요.', zh: '听音乐让心情平静。' }] },
  { w: '함께 해서 좋아요', ph: 'ham-kke hae-seo jo-a-yo', mean: '一起做真好', level: '高级', ex: [{ ko: '당신과 함께해서 좋아요.', zh: '和你一起真好。' }, { ko: '팀원들과 함께해서 좋아요.', zh: '和团队成员一起真好。' }] },
  { w: '천천히 생각해 볼게요', ph: 'cheon-cheon-hi saeng-ga-kae bol-ge-yo', mean: '我会慢慢考虑', level: '高级', ex: [{ ko: '급하지 않아요, 천천히 생각해 볼게요.', zh: '不急，我会慢慢考虑。' }, { ko: '잘 생각해 볼게요.', zh: '我会好好想想。' }] },
  { w: '의견을 내주세요', ph: 'ui-gyeon-eul nae-ju-se-yo', mean: '请提出意见', level: '高级', ex: [{ ko: '자유롭게 의견을 내주세요.', zh: '请自由提出意见。' }, { ko: '좋은 의견을 내주세요.', zh: '请给些好建议。' }] },
  { w: '상황을 정리해 볼게요', ph: 'sang-hwang-eul jeong-ni-hae bol-ge-yo', mean: '我来梳理情况', level: '高级', ex: [{ ko: '일단 상황을 정리해 볼게요.', zh: '我先梳理一下情况。' }, { ko: '회의 후 상황을 정리해 볼게요.', zh: '会后我来整理情况。' }] },
  { w: '가능한 빨리 연락주세요', ph: 'ga-neung-han ppal-li yeol-lak ju-se-yo', mean: '请尽快联系', level: '高级', ex: [{ ko: '문제 생기면 가능한 빨리 연락주세요.', zh: '有问题请尽快联系。' }, { ko: '결과 나오면 빨리 연락주세요.', zh: '有结果请尽快联系。' }] },
  { w: '이 부분을 다시 검토할게요', ph: 'i bu-bun-eul da-si geom-to-hal-ge-yo', mean: '这部分我再检讨', level: '高级', ex: [{ ko: '이 부분을 다시 검토할게요.', zh: '这部分我再检讨。' }, { ko: '자료 보고 다시 검토할게요.', zh: '看了资料再检讨。' }] },
  { w: '정말 죄송합니다', ph: 'jeong-mal joe-song-ham-ni-da', mean: '非常抱歉', level: '高级', ex: [{ ko: '지연되어 정말 죄송합니다.', zh: '延误了，非常抱歉。' }, { ko: '실수해서 정말 죄송합니다.', zh: '搞错了，非常抱歉。' }] },
  { w: '최선을 다하겠습니다', ph: 'choe-seon-eul da-ha-get-seum-ni-da', mean: '我会尽全力', level: '高级', ex: [{ ko: '약속대로 최선을 다하겠습니다.', zh: '我定会全力以赴。' }, { ko: '임무에 최선을 다하겠습니다.', zh: '我会为任务尽全力。' }] }
];
/* ---- 日语日常问候（分级） ---- */
const JP_GREET = [
  /* 初级 */
  { w: 'こんにちは', ph: 'kon-ni-chi-wa', mean: '你好', level: '初级', ex: [{ ja: 'こんにちは、はじめまして。', zh: '你好，初次见面。' }, { ja: 'こんにちは、お元気ですか。', zh: '你好，最近好吗？' }] },
  { w: 'ありがとう', ph: 'a-ri-ga-tou', mean: '谢谢', level: '初级', ex: [{ ja: '手伝ってくれてありがとう。', zh: '谢谢你帮忙。' }, { ja: '本当にありがとうございます。', zh: '真的很感谢。' }] },
  { w: 'すみません', ph: 'su-mi-ma-sen', mean: '对不起/打扰了', level: '初级', ex: [{ ja: '遅れてすみません。', zh: '迟到了，对不起。' }, { ja: 'すみません、水をください。', zh: '不好意思，请给我水。' }] },
  { w: '愛してる', ph: 'a-i-shi-te-ru', mean: '我爱你', level: '初级', ex: [{ ja: '家族を愛してる。', zh: '我爱家人。' }, { ja: '日本が好きです。', zh: '我喜欢日本。' }] },
  { w: 'ご飯食べた?', ph: 'go-han ta-be-ta', mean: '吃饭了吗？', level: '初级', ex: [{ ja: 'お昼ご飯食べた?', zh: '吃午饭了吗？' }, { ja: '美味しく食べてね。', zh: '吃得香香的哦。' }] },
  { w: 'さようなら', ph: 'sa-yo-u-na-ra', mean: '再见', level: '初级', ex: [{ ja: 'それでは、さようなら。', zh: '那么，再见。' }, { ja: 'またね、さようなら。', zh: '回头见，拜拜。' }] },
  { w: 'おはよう', ph: 'o-ha-yo-u', mean: '早上好', level: '初级', ex: [{ ja: 'おはようございます。', zh: '早上好（敬语）。' }, { ja: 'おはよう、よく眠れた?', zh: '早，睡得好吗？' }] },
  { w: 'こんばんは', ph: 'kon-ban-wa', mean: '晚上好', level: '初级', ex: [{ ja: 'こんばんは、お帰りなさい。', zh: '晚上好，欢迎回来。' }, { ja: 'こんばんは、夕飯は?', zh: '晚上好，吃晚饭了吗？' }] },
  { w: 'はい', ph: 'hai', mean: '是', level: '初级', ex: [{ ja: 'はい、わかりました。', zh: '是，我明白了。' }, { ja: 'はい、そうです。', zh: '是的，没错。' }] },
  { w: 'いいえ', ph: 'i-i-e', mean: '不', level: '初级', ex: [{ ja: 'いいえ、違います。', zh: '不，不是那样。' }, { ja: 'いいえ、結構です。', zh: '不，不用了。' }] },
  { w: 'お名前は？', ph: 'o-na-ma-e wa', mean: '你叫什么名字？', level: '初级', ex: [{ ja: 'ちょっと、お名前は？', zh: '等等，你叫什么名字？' }, { ja: 'はじめまして、お名前は？', zh: '初次见面，你叫什么？' }] },
  { w: 'お元気ですか', ph: 'o-gen-ki desu ka', mean: '你好吗？', level: '初级', ex: [{ ja: '久しぶり、お元気ですか。', zh: '好久不见，你好吗？' }, { ja: 'お元気ですか、元気だよ。', zh: '你好吗？我挺好的。' }] },
  /* 中级 */
  { w: 'おやすみなさい', ph: 'o-ya-su-mi-na-sai', mean: '晚安', level: '中级', ex: [{ ja: '疲れたね、おやすみなさい。', zh: '累了吧，晚安。' }, { ja: 'いい夢を見てね。', zh: '做个好梦。' }] },
  { w: 'がんばって', ph: 'gan-ba-tte', mean: '加油', level: '中级', ex: [{ ja: '試験がんばって!', zh: '考试加油！' }, { ja: '一緒にがんばろう。', zh: '一起加油吧。' }] },
  { w: 'どこ行くの?', ph: 'do-ko i-ku-no', mean: '去哪儿？', level: '中级', ex: [{ ja: '今どこ行くの?', zh: '现在去哪儿？' }, { ja: '学校に行くの。', zh: '去学校。' }] },
  { w: '時間ある?', ph: 'ji-kan a-ru', mean: '有时间吗？', level: '中级', ex: [{ ja: '明日時間ある?', zh: '明天有时间吗？' }, { ja: 'ちょっと話そうか。', zh: '聊会儿？' }] },
  { w: 'もう一度', ph: 'mou ichi-do', mean: '再来一遍', level: '中级', ex: [{ ja: 'もう一度お願いします。', zh: '请再来一次。' }, { ja: 'もう一度やってみて。', zh: '再试一次吧。' }] },
  { w: 'ゆっくり話して', ph: 'yuk-ku-ri ha-na-shi-te', mean: '慢慢说', level: '中级', ex: [{ ja: 'よく聞こえない、ゆっくり話して。', zh: '听不清，请慢慢说。' }, { ja: '外国人だからゆっくり話して。', zh: '我是外国人，请慢点说。' }] },
  { w: 'いくらですか', ph: 'i-ku-ra desu ka', mean: '多少钱？', level: '中级', ex: [{ ja: 'これはいくらですか。', zh: '这个多少钱？' }, { ja: '全部でいくらですか。', zh: '一共多少钱？' }] },
  { w: 'どこですか', ph: 'do-ko desu ka', mean: '在哪里？', level: '中级', ex: [{ ja: 'トイレはどこですか。', zh: '洗手间在哪里？' }, { ja: '駅はどこですか。', zh: '车站在哪里？' }] },
  { w: '何してる?', ph: 'na-ni shi-te-ru', mean: '在做什么？', level: '中级', ex: [{ ja: '今何してる?', zh: '现在在做什么？' }, { ja: '暇だよ、何してる?', zh: '我闲着，你在干嘛？' }] },
  { w: '一緒に行こう', ph: 'issho ni i-kou', mean: '一起去吧', level: '中级', ex: [{ ja: '時間があれば一緒に行こう。', zh: '有时间的话一起去吧。' }, { ja: '週末一緒に行こう。', zh: '周末一起去吧。' }] },
  { w: 'おいしい', ph: 'o-i-shii', mean: '好吃', level: '中级', ex: [{ ja: '本当においしい!', zh: '真的很好吃！' }, { ja: '一度食べて、おいしいよ。', zh: '尝尝看，很好吃。' }] },
  { w: 'わかりました', ph: 'wa-ka-ri-ma-shi-ta', mean: '我明白了', level: '中级', ex: [{ ja: 'はい、わかりました。', zh: '好的，我明白了。' }, { ja: '説明してくれて、わかりました。', zh: '你一解释我就懂了。' }] },
  /* 高级 */
  { w: 'お元気で', ph: 'o-gen-ki-de', mean: '请保重', level: '高级', ex: [{ ja: '寒くなりました、お元気で。', zh: '天冷了，请保重。' }, { ja: 'お体に気をつけて、お元気で。', zh: '注意身体，请保重。' }] },
  { w: '成功を祈る', ph: 'sei-kou o ino-ru', mean: '祝你成功', level: '高级', ex: [{ ja: '新しいプロジェクトの成功を祈ります。', zh: '祝新项目成功。' }, { ja: '試験の成功を祈ります。', zh: '祝考试成功。' }] },
  { w: '思ったよりいい', ph: 'o-mo-tte iru yori ii', mean: '比想象中好', level: '高级', ex: [{ ja: '結果は思ったよりいいです。', zh: '结果比预想的好。' }, { ja: '状況は思ったよりいい。', zh: '情况比想象的要好。' }] },
  { w: '心が穏やか', ph: 'ko-ko-ro ga oda-ya-ka', mean: '内心平静', level: '高级', ex: [{ ja: 'ここでは心が穏やかです。', zh: '在这里内心很安宁。' }, { ja: '音楽を聞いて心が穏やかです。', zh: '听音乐让心情平静。' }] },
  { w: '一緒で良かった', ph: 'issho de yo-kat-ta', mean: '一起真好', level: '高级', ex: [{ ja: 'あなたと一緒で良かった。', zh: '和你一起真好。' }, { ja: 'みんなと一緒で良かった。', zh: '和大家一起真好。' }] },
  { w: 'ゆっくり考えます', ph: 'yukkuri kangae-masu', mean: '我会慢慢考虑', level: '高级', ex: [{ ja: '急がないから、ゆっくり考えます。', zh: '不着急，我会慢慢考虑。' }, { ja: 'よく考えます。', zh: '我会好好想想。' }] },
  { w: 'ご意見をください', ph: 'go-iken o kudasai', mean: '请给意见', level: '高级', ex: [{ ja: '自由にご意見をください。', zh: '请自由提出意见。' }, { ja: '良いご意見をください。', zh: '请给些好建议。' }] },
  { w: '状況を整理します', ph: 'joukyou o seiri shimasu', mean: '我来梳理情况', level: '高级', ex: [{ ja: 'まず状況を整理します。', zh: '我先梳理一下情况。' }, { ja: '会議の後状況を整理します。', zh: '会后我来整理情况。' }] },
  { w: 'できるだけ早く連絡してください', ph: 'dekiru dake hayaku renraku shite kudasai', mean: '请尽快联系', level: '高级', ex: [{ ja: '問題があればできるだけ早く連絡してください。', zh: '有问题请尽快联系。' }, { ja: '結果が出たら早く連絡してください。', zh: '有结果请尽快联系。' }] },
  { w: 'この部分を再検討します', ph: 'kono bubun o saikentou shimasu', mean: '这部分再检讨', level: '高级', ex: [{ ja: 'この部分を再検討します。', zh: '这部分我再检讨。' }, { ja: '資料を見て再検討します。', zh: '看了资料再检讨。' }] },
  { w: '本当に申し訳ありません', ph: 'hontou ni moushiwake arimasen', mean: '非常抱歉', level: '高级', ex: [{ ja: '遅れて本当に申し訳ありません。', zh: '迟到了，非常抱歉。' }, { ja: 'ミスして本当に申し訳ありません。', zh: '搞错了，非常抱歉。' }] },
  { w: '全力を尽くします', ph: 'zenryoku o tsukushimasu', mean: '我会尽全力', level: '高级', ex: [{ ja: '約束通り全力を尽くします。', zh: '我定会全力以赴。' }, { ja: '任務に全力を尽くします。', zh: '我会为任务尽全力。' }] }
];
/* ---- 拼写法则 ---- */
const KR_SPELL = [
  '【收音(받침)】韩语音节结尾的辅音叫收音。一个音节最多一个收音，常见如 ㄱ/ㄴ/ㄷ/ㄹ/ㅁ/ㅂ/ㅇ/ㅅ 等。',
  '【连音】当前一音节有收音、后一音节以元音开头时，收音滑到后一音节发音，如 잘 있어요 → [자리써요]。',
  '【送气化】ㄱ/ㄷ/ㅂ/ㅈ 遇到 ㅎ 时送气成 ㅋ/ㅌ/ㅍ/ㅊ，如 좋다 + 하다 → 좋아하다[조타하다]。',
  '【紧音化】收音 ㄱ/ㄷ/ㅂ 后接 ㄱ/ㄷ/ㅂ/ㅅ/ㅈ 时，后字发紧音，如 학교[학꾜]。'
];
const JP_SPELL = [
  '【促音(っ)】双辅音停顿，如 がっこう(学校)、きっぷ(切符)，发音时此处短促顿一下。',
  '【长音(ー)】元音拉长一拍，如 おばさん(阿姨) vs おばあさん(奶奶)，靠长音区分意思。',
  '【浊音/半浊音】は行在词中常浊化为 ば/ぱ 行，如 はな(花) vs はなび(花火→はなび)。',
  '【拗音】い段假名 + 小写上/ゆ/よ 构成，如 きゃ/きゅ/きょ，发音为一拍。'
];
/* ---- 口语素材 ---- */
const KR_SPOKEN = [
  { id: 'ks1', t: '오늘 날씨 참 좋네요.', zh: '今天天气真好啊。' },
  { id: 'ks2', t: '잠시만요, 찾아볼게요.', zh: '稍等，我查一下。' },
  { id: 'ks3', t: '시간 되면 같이 가요.', zh: '有时间的话一起去吧。' },
  { id: 'ks4', t: '이것 좀 도와주실래요?', zh: '能帮我一下这个吗？' },
  { id: 'ks5', t: '맛있게 드세요.', zh: '请慢用（吃得香）。' },
  { id: 'ks6', t: '뭐 필요한 거 있어요?', zh: '有什么需要的吗？' },
  { id: 'ks7', t: '천천히 말씀해 주세요.', zh: '请慢慢说。' },
  { id: 'ks8', t: '다시 한 번 말해 주세요.', zh: '请再说一遍。' },
  { id: 'ks9', t: '약속 시간 잊지 마세요.', zh: '别忘记约定的时间。' },
  { id: 'ks10', t: '오늘 수고하셨어요.', zh: '今天辛苦了。' },
  { id: 'ks11', t: '기분 전환하고 왔어요.', zh: '我去换个心情回来了。' },
  { id: 'ks12', t: '조금만 기다려 주세요.', zh: '请稍等我一下。' },
  { id: 'ks13', t: '정말 대단하시네요.', zh: '您真厉害。' },
  { id: 'ks14', t: '함께 해결해 봐요.', zh: '我们一起解决吧。' },
  { id: 'ks15', t: '내일 또 만나요.', zh: '明天再见。' },
  { id: 'ks16', t: '오늘 정말 고마웠어요.', zh: '今天真的很感谢。' },
  { id: 'ks17', t: '조금 쉬었다 갈래요?', zh: '要休息一下再走吗？' },
  { id: 'ks18', t: '이거 어떻게 생각해요?', zh: '你觉得这个怎么样？' },
  { id: 'ks19', t: '내일은 늦잠 자도 돼요.', zh: '明天可以睡个懒觉。' },
  { id: 'ks20', t: '함께 식사할래요?', zh: '要一起吃饭吗？' },
  { id: 'ks21', t: '길을 잃었어요, 도와주세요.', zh: '我迷路了，帮帮我。' },
  { id: 'ks22', t: '사진 한 장 찍어도 돼요?', zh: '可以拍张照吗？' },
  { id: 'ks23', t: '날씨가 흐리네요.', zh: '天气阴沉沉的。' },
  { id: 'ks24', t: '기분이 좋아요 오늘.', zh: '今天心情很好。' },
  { id: 'ks25', t: '천천히 걸어도 괜찮아요.', zh: '慢慢走也没关系。' }
];
const JP_SPOKEN = [
  { id: 'js1', t: '今日はいい天気ですね。', zh: '今天天气真好呢。' },
  { id: 'js2', t: 'ちょっと待ってください。', zh: '请稍等一下。' },
  { id: 'js3', t: '時間があれば一緒に行きましょう。', zh: '有时间的话一起去吧。' },
  { id: 'js4', t: 'これを手伝ってもらえますか。', zh: '能帮我一下这个吗？' },
  { id: 'js5', t: 'ゆっくり食べてください。', zh: '请慢慢吃。' },
  { id: 'js6', t: '何か必要な物はありますか。', zh: '有什么需要的东西吗？' },
  { id: 'js7', t: 'もう少しゆっくり話してください。', zh: '请再慢一点说。' },
  { id: 'js8', t: 'もう一度言ってください。', zh: '请再说一遍。' },
  { id: 'js9', t: '約束の時間を忘れないでね。', zh: '别忘记约定的时间哦。' },
  { id: 'js10', t: '今日はお疲れ様でした。', zh: '今天辛苦了。' },
  { id: 'js11', t: '気分転換してきたよ。', zh: '我去换个心情回来了。' },
  { id: 'js12', t: '少し待ってくれますか。', zh: '请稍等我一下。' },
  { id: 'js13', t: '本当にすごいですね。', zh: '真厉害呢。' },
  { id: 'js14', t: '一緒に解決しましょう。', zh: '一起解决吧。' },
  { id: 'js15', t: '明日また会いましょう。', zh: '明天再见吧。' },
  { id: 'js16', t: '今日は本当にありがとう。', zh: '今天真的很感谢。' },
  { id: 'js17', t: '少し休んでいきませんか？', zh: '要休息一下再走吗？' },
  { id: 'js18', t: 'これ、どう思う？', zh: '你觉得这个怎么样？' },
  { id: 'js19', t: '明日は朝寝坊してもいいよ。', zh: '明天可以睡个懒觉。' },
  { id: 'js20', t: '一緒にご飯でもどう？', zh: '要一起吃饭吗？' },
  { id: 'js21', t: '道に迷った、助けて。', zh: '我迷路了，帮帮我。' },
  { id: 'js22', t: '写真を一枚撮ってもいい？', zh: '可以拍张照吗？' },
  { id: 'js23', t: '曇り空だね。', zh: '天气阴沉沉的。' },
  { id: 'js24', t: '今日は気分がいいよ。', zh: '今天心情很好。' },
  { id: 'js25', t: 'ゆっくり歩いても大丈夫。', zh: '慢慢走也没关系。' }
];
/* ---- 文化 ---- */
const KR_CULTURE = [
  { c: '한식(韩食)', zh: '韩国饮食以米饭为主，泡菜(김치)几乎是每餐必备，烤肉、部队锅、拌饭也很有名。' },
  { c: '설날(春节)', zh: '韩国春节也祭祖、穿韩服、行叩拜礼(세배)，吃年糕汤(떡국)寓意长一岁。' },
  { c: '한복(韩服)', zh: '传统服饰，线条柔和、色彩素雅，节日与婚礼常见，现代也有改良日常款。' },
  { c: 'PC방(网吧)', zh: '韩国网吧文化发达，常按小时计费，附带饮料泡面，是年轻人社交与游戏据点。' },
  { c: '벚꽃(樱花)', zh: '春天首尔汝矣岛、庆熙大学樱花大道人潮涌动，年轻人会野餐赏樱。' },
  { c: '아이돌(偶像)', zh: 'K-pop 偶像产业成熟，练习生制度严格，应援色与应援棒文化盛行。' },
  { c: '찜질방(汗蒸幕)', zh: '类似桑拿，常通宵聚会聊天，是韩国特色的休闲社交方式。' },
  { c: '반말/존댓말(平语/敬语)', zh: '韩语根据年龄亲疏严格区分敬语与平语，对长辈必用敬语是基本礼仪。' },
  { c: '추석(中秋)', zh: '与春节并列的重大节日，返乡祭祖、吃松饼(송편)，重视家族团聚。' },
  { c: '한강(汉江)', zh: '首尔的汉江公园是市民夜跑、野餐、看夜景的好去处，外卖炸鸡啤酒常配送到江边。' },
  { c: '복장(着装)', zh: '职场与校园对穿着有隐性规范，换季时流行色常由偶像带火。' },
  { c: '예절(礼仪)', zh: '递接物品用双手、长辈先动筷、饮酒侧身，是深入日常的礼仪细节。' }
];
const JP_CULTURE = [
  { c: '和食(わしょく)', zh: '日本料理讲究季节与原味，米饭、味噌汤、刺身、怀石料理皆有名，注重摆盘留白。' },
  { c: 'お祭り(祭典)', zh: '各地夏季花火大会、秋日祭典热闹非凡，浴衣、捞金鱼、章鱼烧是标配。' },
  { c: '桜(樱花)', zh: '春天全民赏樱(花見)，在树下野餐喝酒，花期虽短却象征无常与珍惜当下。' },
  { c: 'お辞儀(鞠躬)', zh: '见面与道别深深鞠躬，角度代表敬意深浅，是日常基本礼仪。' },
  { c: '温泉(おんせん)', zh: '泡汤文化兴盛，公共温泉须先冲洗、不穿泳衣入池，注重安静与规矩。' },
  { c: '漫画/アニメ', zh: '漫画与动画产业全球知名，从少年Jump到吉卜力，覆盖各年龄层。' },
  { c: '茶道(さどう)', zh: '抹茶仪式讲究步骤与心境，体现"和敬清寂"的审美。' },
  { c: '便利商店', zh: '便利店密度极高，ATM、打印、缴费、简餐一应俱全，深夜生活依赖它。' },
  { c: '季語(きご)', zh: '俳句与日常表达重视季节词，春樱夏萤秋月冬雪，时间感细腻。' },
  { c: 'お土産(伴手礼)', zh: '旅行归来必带特产分送同事朋友，是维系关系的小小仪式。' },
  { c: '细心さ(细致)', zh: '服务与产品对细节的苛求深入骨髓，包装、说明、动线都替用户想在前。' },
  { c: '祭りの屋台', zh: '节日临时摊位卖烤团子、苹果糖、钓水球，是童年记忆的甜。' }
];
/* ---- 对话练习（本地规则 AI，纯前端模拟） ---- */
const KR_CHAT_RULES = [
  { k: ['你好', 'hi', 'hello', '안녕'], bot: '안녕하세요! 만나서 반갑습니다.', zh: '你好！很高兴见到你。' },
  { k: ['谢谢', '감사', '고마'], bot: '천만에요!', zh: '不客气！' },
  { k: ['喜欢', '좋아', '사랑'], bot: '저도 좋아해요!', zh: '我也很喜欢！' },
  { k: ['吃饭', '밥', '먹'], bot: '밥 먹었어요? 맛있게 드세요.', zh: '吃饭了吗？请慢用。' },
  { k: ['再见', '바이', '잘'], bot: '안녕히 가세요! 또 만나요.', zh: '再见！下次见。' },
  { k: ['名字', '이름'], bot: '이름이 뭐예요? 저도 말해 줄래요?', zh: '你叫什么名字？要我也说吗？' },
  { k: ['几岁', '나이', '몇'], bot: '몇 살이에요? 저도 궁금해요.', zh: '你几岁？我也好奇呢。' }
];
const JP_CHAT_RULES = [
  { k: ['你好', 'hi', 'hello', 'こんに'], bot: 'こんにちは！はじめまして。', zh: '你好！初次见面。' },
  { k: ['谢谢', 'ありがと', '感謝'], bot: 'どういたしまして！', zh: '不客气！' },
  { k: ['喜欢', '好き', '愛'], bot: '私も好きです！', zh: '我也很喜欢！' },
  { k: ['吃饭', 'ご飯', '食べ'], bot: 'ご飯食べた？美味しく食べてね。', zh: '吃饭了吗？吃得香香的哦。' },
  { k: ['再见', 'ばい', 'また'], bot: 'さようなら！また会いましょう。', zh: '再见！下次见吧。' },
  { k: ['名字', '名前'], bot: 'お名前は何ですか？', zh: '你叫什么名字？' },
  { k: ['几岁', '何歳', '年'], bot: 'おいくつですか？', zh: '你几岁了？' }
];
function chatReply(rules, text) {
  const t = (text || '').toLowerCase();
  for (const r of rules) if (r.k.some(k => t.includes(k.toLowerCase()))) return r;
  if (rules === KR_CHAT_RULES) return { bot: '재미있네요! 계속 이야기해요.', zh: '真有意思！继续聊吧。' };
  return { bot: '面白いですね！続きましょう。', zh: '很有意思呢！继续吧。' };
}

/* ============ 渲染 ============ */
function foreignTabBar() {
  const tabs = [['en', '🔤 英语学习'], ['kr', '🇰🇷 韩语学习'], ['jp', '🇯🇵 日语学习']];
  return `<div class="subtabs">${tabs.map(t => `<button class="btn sm ${S.forTab === t[0] ? 'pink' : 'ghost'}" onclick="S.forTab='${t[0]}';S.sentEdit=null;render()">${t[1]}</button>`).join('')}</div>`;
}
function render_foreign() {
  const body = S.forTab === 'en' ? englishFrag() : (S.forTab === 'kr' ? krBody() : jpBody());
  return `
  <div class="page-title">🌐 外语学习</div>
  <div class="page-sub">英语 · 韩语 · 日语，从发音到对话一点点啃</div>
  ${foreignTabBar()}
  ${body}`;
}
function krBody() {
  const tabs = [['tool', '📚 工具库'], ['forty', '🔡 四十音'], ['greet', '👋 日常问候'], ['spell', '📐 拼写法则'], ['spoken', '💬 口语素材'], ['vocab', '📕 主题词汇'], ['mine', '📥 我的词库'], ['chat', '🤖 对话练习'], ['culture', '🍱 韩国文化']];
  let body = '';
  if (S.krSub === 'tool') {
    body = `<div class="card"><h3>📚 分级中韩词典</h3>
      <div class="row"><select id="krLevel" onchange="S.krLevel=this.value;render()">${['初级', '中级', '高级'].map(l => `<option ${S.krLevel === l ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <span class="li-sub">当前等级：<b>${S.krLevel}</b>，影响「日常问候」词库</span></div>
      <div class="poem-sec" style="margin-top:8px">说明：词典分级用于筛选「日常问候」推送的词汇难度。初级为最常用表达，高级偏书面/细腻。可随时切换。</div>
    </div>`;
  } else if (S.krSub === 'forty') {
    body = `
    <div class="card"><h3>🔡 辅音（19 个）</h3>
      <div class="mod-grid">${KR_CONS.map((c, i) => `<div class="mod-card" style="padding:10px 4px"><span class="ic" style="width:40px;height:40px"><span class="emoji-ic" style="font-size:22px">${c[0]}</span></span><div class="nm" style="font-size:11px">${c[1]}<br>${c[2]}</div>
        <div class="row mt" style="justify-content:center;gap:4px"><button class="btn sm" onclick="speak('${c[0]}','ko-KR')">🔊</button><span id="kc_${i}"></span><button class="btn sm ghost" onclick="recToggle('kc_${i}','ko-KR')">🎙</button></div></div>`).join('')}</div>
    </div>
    <div class="card"><h3>🔡 元音（21 个）</h3>
      <div class="mod-grid">${KR_VOW.map((v, i) => `<div class="mod-card" style="padding:10px 4px"><span class="ic" style="width:40px;height:40px"><span class="emoji-ic" style="font-size:22px">${v[0]}</span></span><div class="nm" style="font-size:11px">${v[1]}<br>${v[2]}</div>
        <div class="row mt" style="justify-content:center;gap:4px"><button class="btn sm" onclick="speak('${v[0]}','ko-KR')">🔊</button><span id="kv_${i}"></span><button class="btn sm ghost" onclick="recToggle('kv_${i}','ko-KR')">🎙</button></div></div>`).join('')}</div>
    </div>`;
  } else if (S.krSub === 'greet') {
    const pool = KR_GREET.filter(x => x.level === S.krLevel);
    const start = (dayIdx * 5) % Math.max(1, pool.length - 4);
    const today5 = pool.slice(start, start + 5);
    const fav = store.g('krGreetFav', []);
    body = `<div class="card"><h3>👋 日常问候（${S.krLevel} · 每日 5 词）</h3>
      ${today5.map((w, i) => `<div class="card" style="padding:12px">
        <div class="row" style="justify-content:space-between;align-items:center"><div><b style="font-size:16px">${esc(w.w)}</b> <span class="li-sub">${esc(w.ph)}</span></div>
          <div class="row" style="gap:6px"><button class="btn sm" onclick="speak('${w.w.replace(/'/g, "\\'")}','ko-KR')">🔊</button><span id="kg_${i}"></span><button class="btn sm ghost" onclick="recToggle('kg_${i}','ko-KR')">🎙</button>
          <button class="btn sm ${fav.includes(w.w) ? 'pink' : 'ghost'}" onclick="toggleKrGreet('${esc(w.w)}')">${fav.includes(w.w) ? '❤' : '♡'}</button></div></div>
        <div class="li-sub" style="margin-top:4px">${esc(w.mean)}</div>
        ${w.ex.map((x, ei) => `<div class="list-item" style="border:none;padding:6px 0"><div class="li-main" style="display:flex;gap:6px;align-items:flex-start"><span style="flex:1">${esc(x.ko)}<div class="li-sub">${esc(x.zh)}</div></span><button class="btn sm" onclick="speak('${x.ko.replace(/'/g, "\\'")}','ko-KR')">🔊</button></div>
          <div class="row mt" style="justify-content:flex-start"><span id="kge_${i}_${ei}"></span><button class="btn sm ghost" onclick="recToggle('kge_${i}_${ei}','ko-KR')">🎙</button></div></div>`).join('')}
      </div>`).join('')}
    </div>`;
  } else if (S.krSub === 'spell') {
    body = KR_SPELL.map(s => `<div class="card"><div class="poem-sec">${esc(s)}</div></div>`).join('');
  } else if (S.krSub === 'spoken') {
    const fav = store.g('krSpokenFav', []);
    const tab = S.krSpokenTab; // 'daily' | 'all' | 'fav'
    let list, label;
    if (tab === 'fav') { list = KR_SPOKEN.filter(s => fav.includes(s.id)); label = '❤ 常用口语'; }
    else if (tab === 'all') { list = KR_SPOKEN; label = '全部 ' + KR_SPOKEN.length + ' 条'; }
    else { const st = (dayIdx * 5) % Math.max(1, KR_SPOKEN.length - 4); list = KR_SPOKEN.slice(st, st + 5); label = '每日 5 条'; }
    const tb = (k, t) => `<button class="btn sm ${S.krSpokenTab === k ? 'pink' : 'ghost'}" onclick="S.krSpokenTab='${k}';render()">${t}</button>`;
    body = `<div class="card"><div class="row" style="justify-content:space-between">
        <h3 style="margin:0">💬 口语素材（${label}）</h3>
        <div class="row" style="gap:6px">${tb('daily','每日')}${tb('all','全部')}${tb('fav','❤ 常用')}</div>
      </div></div>
      ${list.length ? list.map(s => `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(s.t)}</b><span class="li-sub">${esc(s.zh)}</span>
        <button class="btn sm" onclick="speak('${s.t.replace(/'/g, "\\'")}','ko-KR')">🔊</button><span id="ks_${s.id}"></span><button class="btn sm ghost" onclick="recToggle('ks_${s.id}','ko-KR')">🎙</button>
        <button class="btn sm ${fav.includes(s.id) ? 'pink' : 'ghost'}" onclick="toggleKrSpoken('${s.id}')">${fav.includes(s.id) ? '已收藏 ❤' : '收藏 ♡'}</button></div></div>`).join('') : '<div class="empty">常用口语还是空的，去「全部」里点 ♡ 收藏吧～</div>'}`;
  } else if (S.krSub === 'chat') {
    body = krChatBox();
  } else if (S.krSub === 'culture') {
    const start = (dayIdx * 3) % Math.max(1, KR_CULTURE.length - 2);
    const today3 = KR_CULTURE.slice(start, start + 3);
    body = `<div class="card"><h3>🍱 韩国文化（每日 3 条）</h3></div>` + today3.map(c => `<div class="card"><div class="row" style="justify-content:space-between"><b>${esc(c.c)}</b></div><div class="poem-sec" style="margin-top:6px">${esc(c.zh)}</div></div>`).join('');
  } else if (S.krSub === 'vocab') {
    body = vbBody(KR_VOCAB, 'KR_VOCAB', KR_VCFG);
  } else if (S.krSub === 'mine') {
    body = myVocabManage('ko-KR', 'ko', 'MY_KR', MY_KR_CFG);
  }
  return `<div class="tabs">${tabs.map(t => `<div class="tab ${S.krSub === t[0] ? 'active' : ''}" onclick="S.krSub='${t[0]}';render()">${t[1]}</div>`).join('')}</div>${body}
    <div class="li-sub" style="margin-top:10px">🔊 点喇叭跟读原音 · 🎙 点麦克风录下你的发音对比（需授权麦克风，建议用 https 或 localhost 打开）</div>`;
}
function jpBody() {
  const tabs = [['tool', '📚 工具库'], ['fifty', '🔡 五十音'], ['greet', '👋 日常问候'], ['spell', '📐 拼写法则'], ['spoken', '💬 口语素材'], ['vocab', '📕 主题词汇'], ['mine', '📥 我的词库'], ['chat', '🤖 对话练习'], ['culture', '🍱 日本文化']];
  let body = '';
  if (S.jpSub === 'tool') {
    body = `<div class="card"><h3>📚 分级中日词典</h3>
      <div class="row"><select id="jpLevel" onchange="S.jpLevel=this.value;render()">${['初级', '中级', '高级'].map(l => `<option ${S.jpLevel === l ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <span class="li-sub">当前等级：<b>${S.jpLevel}</b>，影响「日常问候」词库</span></div>
      <div class="poem-sec" style="margin-top:8px">说明：词典分级用于筛选「日常问候」推送的词汇难度。可随时切换。</div>
    </div>`;
  } else if (S.jpSub === 'fifty') {
    const block = (title, arr) => `<div class="card"><h3>${title}</h3><div class="mod-grid">${arr.map((c, i) => `<div class="mod-card" style="padding:10px 4px"><span class="ic" style="width:40px;height:40px"><span class="emoji-ic" style="font-size:20px">${c[0]}</span></span><div class="nm" style="font-size:11px">${c[1]}</div>
        <div class="row mt" style="justify-content:center;gap:4px"><button class="btn sm" onclick="speak('${c[0]}','ja-JP')">🔊</button><span id="jp_${title}_${i}"></span><button class="btn sm ghost" onclick="recToggle('jp_${title}_${i}','ja-JP')">🎙</button></div></div>`).join('')}</div></div>`;
    body = block('清音(46)', JP_GOJUON) + block('浊音/半浊(25)', JP_DAKUON) + block('拗音(27)', JP_YOON);
  } else if (S.jpSub === 'greet') {
    const pool = JP_GREET.filter(x => x.level === S.jpLevel);
    const start = (dayIdx * 5) % Math.max(1, pool.length - 4);
    const today5 = pool.slice(start, start + 5);
    body = `<div class="card"><h3>👋 日常问候（${S.jpLevel} · 每日 5 词）</h3>
      ${today5.map((w, i) => `<div class="card" style="padding:12px">
        <div class="row" style="justify-content:space-between;align-items:center"><div><b style="font-size:16px">${esc(w.w)}</b> <span class="li-sub">${esc(w.ph)}</span></div>
          <div class="row" style="gap:6px"><button class="btn sm" onclick="speak('${w.w.replace(/'/g, "\\'")}','ja-JP')">🔊</button><span id="jg_${i}"></span><button class="btn sm ghost" onclick="recToggle('jg_${i}','ja-JP')">🎙</button></div></div>
        <div class="li-sub" style="margin-top:4px">${esc(w.mean)}</div>
        ${w.ex.map((x, ei) => `<div class="list-item" style="border:none;padding:6px 0"><div class="li-main" style="display:flex;gap:6px;align-items:flex-start"><span style="flex:1">${esc(x.ja)}<div class="li-sub">${esc(x.zh)}</div></span><button class="btn sm" onclick="speak('${x.ja.replace(/'/g, "\\'")}','ja-JP')">🔊</button></div>
          <div class="row mt" style="justify-content:flex-start"><span id="jge_${i}_${ei}"></span><button class="btn sm ghost" onclick="recToggle('jge_${i}_${ei}','ja-JP')">🎙</button></div></div>`).join('')}
      </div>`).join('')}
    </div>`;
  } else if (S.jpSub === 'spell') {
    body = JP_SPELL.map(s => `<div class="card"><div class="poem-sec">${esc(s)}</div></div>`).join('');
  } else if (S.jpSub === 'spoken') {
    const fav = store.g('jpSpokenFav', []);
    const tab = S.jpSpokenTab; // 'daily' | 'all' | 'fav'
    let list, label;
    if (tab === 'fav') { list = JP_SPOKEN.filter(s => fav.includes(s.id)); label = '❤ 常用口语'; }
    else if (tab === 'all') { list = JP_SPOKEN; label = '全部 ' + JP_SPOKEN.length + ' 条'; }
    else { const st = (dayIdx * 5) % Math.max(1, JP_SPOKEN.length - 4); list = JP_SPOKEN.slice(st, st + 5); label = '每日 5 条'; }
    const tb = (k, t) => `<button class="btn sm ${S.jpSpokenTab === k ? 'pink' : 'ghost'}" onclick="S.jpSpokenTab='${k}';render()">${t}</button>`;
    body = `<div class="card"><div class="row" style="justify-content:space-between">
        <h3 style="margin:0">💬 口语素材（${label}）</h3>
        <div class="row" style="gap:6px">${tb('daily','每日')}${tb('all','全部')}${tb('fav','❤ 常用')}</div>
      </div></div>
      ${list.length ? list.map(s => `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(s.t)}</b><span class="li-sub">${esc(s.zh)}</span>
        <button class="btn sm" onclick="speak('${s.t.replace(/'/g, "\\'")}','ja-JP')">🔊</button><span id="js_${s.id}"></span><button class="btn sm ghost" onclick="recToggle('js_${s.id}','ja-JP')">🎙</button>
        <button class="btn sm ${fav.includes(s.id) ? 'pink' : 'ghost'}" onclick="toggleJpSpoken('${s.id}')">${fav.includes(s.id) ? '已收藏 ❤' : '收藏 ♡'}</button></div></div>`).join('') : '<div class="empty">常用口语还是空的，去「全部」里点 ♡ 收藏吧～</div>'}`;
  } else if (S.jpSub === 'chat') {
    body = jpChatBox();
  } else if (S.jpSub === 'culture') {
    const start = (dayIdx * 3) % Math.max(1, JP_CULTURE.length - 2);
    const today3 = JP_CULTURE.slice(start, start + 3);
    body = `<div class="card"><h3>🍱 日本文化（每日 3 条）</h3></div>` + today3.map(c => `<div class="card"><div class="row" style="justify-content:space-between"><b>${esc(c.c)}</b></div><div class="poem-sec" style="margin-top:6px">${esc(c.zh)}</div></div>`).join('');
  } else if (S.jpSub === 'vocab') {
    body = vbBody(JP_VOCAB, 'JP_VOCAB', JP_VCFG);
  } else if (S.jpSub === 'mine') {
    body = myVocabManage('ja-JP', 'ja', 'MY_JP', MY_JP_CFG);
  }
  return `<div class="tabs">${tabs.map(t => `<div class="tab ${S.jpSub === t[0] ? 'active' : ''}" onclick="S.jpSub='${t[0]}';render()">${t[1]}</div>`).join('')}</div>${body}
    <div class="li-sub" style="margin-top:10px">🔊 点喇叭跟读原音 · 🎙 点麦克风录下你的发音对比（需授权麦克风，建议用 https 或 localhost 打开）</div>`;
}
/* 对话练习盒子 */
function krChatBox() {
  const log = S.chatLog || [];
  return `<div class="card"><h3>🤖 韩语对话练习（本地 AI 模拟）</h3>
    <div class="poem-sec" style="margin-bottom:8px">用中文或韩语和我聊吧～这是纯前端规则对话，会匹配关键词用韩/日回复。想要真人级 AI 对话需接入后端，可后续扩展。</div>
    <div id="chatWin" style="max-height:260px;overflow:auto">${log.map(m => `<div class="list-item" style="border:none;padding:6px 0"><div class="li-main"><span class="tag ${m.role === 'bot' ? 'g' : 'b'}">${m.role === 'bot' ? 'AI' : '我'}</span> ${esc(m.text)}${m.zh ? `<div class="li-sub">${esc(m.zh)}</div>` : ''}</div></div>`).join('') || '<div class="empty">还没有对话，发一句试试～</div>'}</div>
    <div class="row mt"><input class="grow" id="chatIn" placeholder="输入中文或韩语…" onkeydown="if(event.key==='Enter')sendKrChat()"><button class="btn" onclick="sendKrChat()">发送</button></div>
  </div>`;
}
function jpChatBox() {
  const log = S.chatLog || [];
  return `<div class="card"><h3>🤖 日语对话练习（本地 AI 模拟）</h3>
    <div class="poem-sec" style="margin-bottom:8px">用中文或日语和我聊吧～纯前端规则对话，关键词匹配日/中回复。真人级 AI 需接后端。</div>
    <div id="chatWin" style="max-height:260px;overflow:auto">${log.map(m => `<div class="list-item" style="border:none;padding:6px 0"><div class="li-main"><span class="tag ${m.role === 'bot' ? 'g' : 'b'}">${m.role === 'bot' ? 'AI' : '我'}</span> ${esc(m.text)}${m.zh ? `<div class="li-sub">${esc(m.zh)}</div>` : ''}</div></div>`).join('') || '<div class="empty">还没有对话，发一句试试～</div>'}</div>
    <div class="row mt"><input class="grow" id="chatIn" placeholder="输入中文或日语…" onkeydown="if(event.key==='Enter')sendJpChat()"><button class="btn" onclick="sendJpChat()">发送</button></div>
  </div>`;
}
function sendKrChat() {
  const el = document.getElementById('chatIn'); if (!el) return;
  const t = el.value.trim(); if (!t) return;
  const log = S.chatLog || [];
  log.push({ role: 'user', text: t });
  const r = chatReply(KR_CHAT_RULES, t);
  log.push({ role: 'bot', text: r.bot, zh: r.zh });
  S.chatLog = log; render();
  const w = document.getElementById('chatWin'); if (w) w.scrollTop = w.scrollHeight;
}
function sendJpChat() {
  const el = document.getElementById('chatIn'); if (!el) return;
  const t = el.value.trim(); if (!t) return;
  const log = S.chatLog || [];
  log.push({ role: 'user', text: t });
  const r = chatReply(JP_CHAT_RULES, t);
  log.push({ role: 'bot', text: r.bot, zh: r.zh });
  S.chatLog = log; render();
  const w = document.getElementById('chatWin'); if (w) w.scrollTop = w.scrollHeight;
}
/* 收藏 */
function toggleKrGreet(w) { const a = store.g('krGreetFav', []); const i = a.indexOf(w); if (i >= 0) a.splice(i, 1); else a.push(w); store.s('krGreetFav', a); render(); }
function toggleKrSpoken(id) { const a = store.g('krSpokenFav', []); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.push(id); store.s('krSpokenFav', a); render(); }
function toggleJpSpoken(id) { const a = store.g('jpSpokenFav', []); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.push(id); store.s('jpSpokenFav', a); render(); }
/* ============ 韩语主题词汇（8 大主题，每主题 8 词，共 64 词） ============ */
const KR_VOCAB = [
  { w: '하나', ph: 'ha-na', mean: '一', topic: '数字', ex: [{ ko: '하나, 둘, 셋.', zh: '一、二、三。' }, { ko: '사과 하나 주세요.', zh: '请给我一个苹果。' }] },
  { w: '둘', ph: 'dul', mean: '二', topic: '数字', ex: [{ ko: '사람 둘 있어요.', zh: '有两个人。' }, { ko: '두 개 사겠어요.', zh: '我要买两个。' }] },
  { w: '셋', ph: 'set', mean: '三', topic: '数字', ex: [{ ko: '셋 다 해요.', zh: '三个都做。' }, { ko: '고양이가 셋이에요.', zh: '有三只猫。' }] },
  { w: '넷', ph: 'net', mean: '四', topic: '数字', ex: [{ ko: '네 명 왔어요.', zh: '来了四个人。' }, { ko: '사계절 넷이죠.', zh: '四季是四个吧。' }] },
  { w: '다섯', ph: 'da-seot', mean: '五', topic: '数字', ex: [{ ko: '다섯 시예요.', zh: '五点了。' }, { ko: '다섯 권 샀어요.', zh: '买了五本。' }] },
  { w: '여섯', ph: 'yeo-seot', mean: '六', topic: '数字', ex: [{ ko: '여섯 달 됐어요.', zh: '六个月大了。' }, { ko: '여섯 개 있어요.', zh: '有六个。' }] },
  { w: '일곱', ph: 'il-gop', mean: '七', topic: '数字', ex: [{ ko: '일곱 시 기상.', zh: '七点起床。' }, { ko: '일곱 명이요.', zh: '七个人。' }] },
  { w: '여덟', ph: 'yeo-deol', mean: '八', topic: '数字', ex: [{ ko: '여덟 시 영화.', zh: '八点电影。' }, { ko: '여덟 살이에요.', zh: '八岁了。' }] },
  { w: '사과', ph: 'sa-gwa', mean: '苹果', topic: '食物', ex: [{ ko: '사과 좋아해요.', zh: '我喜欢苹果。' }, { ko: '사과 하나 주세요.', zh: '请给我一个苹果。' }] },
  { w: '밥', ph: 'bap', mean: '饭', topic: '食物', ex: [{ ko: '밥 먹었어요?', zh: '吃饭了吗？' }, { ko: '밥 많이 드세요.', zh: '多吃点饭。' }] },
  { w: '물', ph: 'mul', mean: '水', topic: '食物', ex: [{ ko: '물 한 잔 주세요.', zh: '请给我一杯水。' }, { ko: '물 마셨어요.', zh: '喝水了。' }] },
  { w: '빵', ph: 'ppang', mean: '面包', topic: '食物', ex: [{ ko: '빵 사왔어요.', zh: '买面包回来了。' }, { ko: '아침에 빵 먹어요.', zh: '早上吃面包。' }] },
  { w: '고기', ph: 'go-gi', mean: '肉', topic: '食物', ex: [{ ko: '고기 좋아해요.', zh: '我喜欢吃肉。' }, { ko: '고기 구웠어요.', zh: '烤了肉。' }] },
  { w: '생선', ph: 'saeng-seon', mean: '鱼', topic: '食物', ex: [{ ko: '생선 회 좋아요.', zh: '我喜欢生鱼片。' }, { ko: '생선 먹어요.', zh: '吃鱼。' }] },
  { w: '채소', ph: 'chae-so', mean: '蔬菜', topic: '食物', ex: [{ ko: '채소 많이 먹어요.', zh: '多吃蔬菜。' }, { ko: '채소 싱싱해요.', zh: '蔬菜很新鲜。' }] },
  { w: '커피', ph: 'keo-pi', mean: '咖啡', topic: '食物', ex: [{ ko: '커피 한 잔 할래요?', zh: '来杯咖啡吗？' }, { ko: '아침 커피 필수.', zh: '早上必喝咖啡。' }] },
  { w: '어머니', ph: 'eo-meo-ni', mean: '妈妈', topic: '家庭', ex: [{ ko: '어머니가 요리해요.', zh: '妈妈做饭。' }, { ko: '어머니 보고 싶어요.', zh: '想妈妈了。' }] },
  { w: '아버지', ph: 'a-beo-ji', mean: '爸爸', topic: '家庭', ex: [{ ko: '아버지께 연락했어요.', zh: '联系爸爸了。' }, { ko: '아버지가 웃으셨어요.', zh: '爸爸笑了。' }] },
  { w: '누나', ph: 'nu-na', mean: '姐姐(男称)', topic: '家庭', ex: [{ ko: '누나가 도와줬어요.', zh: '姐姐帮了我。' }, { ko: '누나 보고 싶어요.', zh: '想姐姐了。' }] },
  { w: '형', ph: 'hyeong', mean: '哥哥(男称)', topic: '家庭', ex: [{ ko: '형이 왔어요.', zh: '哥哥来了。' }, { ko: '형 말 믿어요.', zh: '信哥哥的话。' }] },
  { w: '동생', ph: 'dong-saeng', mean: '弟弟/妹妹', topic: '家庭', ex: [{ ko: '동생이 귀여워요.', zh: '弟弟/妹妹很可爱。' }, { ko: '동생 학교 가요.', zh: '弟弟去上学。' }] },
  { w: '할머니', ph: 'hal-meo-ni', mean: '奶奶', topic: '家庭', ex: [{ ko: '할머니가 계셔요.', zh: '奶奶在。' }, { ko: '할머니께 인사해요.', zh: '向奶奶问好。' }] },
  { w: '할아버지', ph: 'ha-ra-beo-ji', mean: '爷爷', topic: '家庭', ex: [{ ko: '할아버지 이야기 들어요.', zh: '听爷爷讲故事。' }, { ko: '할아버지 건강하세요.', zh: '爷爷保重身体。' }] },
  { w: '가족', ph: 'ga-jok', mean: '家人', topic: '家庭', ex: [{ ko: '가족과 함께 살아요.', zh: '和家人一起住。' }, { ko: '가족이 중요해요.', zh: '家人很重要。' }] },
  { w: '오늘', ph: 'o-neul', mean: '今天', topic: '时间', ex: [{ ko: '오늘 날씨 좋아요.', zh: '今天天气好。' }, { ko: '오늘 쉴래요.', zh: '今天想休息。' }] },
  { w: '내일', ph: 'nae-il', mean: '明天', topic: '时间', ex: [{ ko: '내일 만나요.', zh: '明天见。' }, { ko: '내일 시험 있어요.', zh: '明天有考试。' }] },
  { w: '어제', ph: 'eo-je', mean: '昨天', topic: '时间', ex: [{ ko: '어제 늦잠 잤어요.', zh: '昨天睡懒觉了。' }, { ko: '어제 영화 봤어요.', zh: '昨天看了电影。' }] },
  { w: '아침', ph: 'a-chim', mean: '早上', topic: '时间', ex: [{ ko: '아침 먹었어요?', zh: '吃早饭了吗？' }, { ko: '아침 산책해요.', zh: '早上散步。' }] },
  { w: '점심', ph: 'jeom-sim', mean: '午饭', topic: '时间', ex: [{ ko: '점심 뭐 먹어요?', zh: '午饭吃什么？' }, { ko: '점심 같이 해요.', zh: '一起吃午饭吧。' }] },
  { w: '저녁', ph: 'jeo-nyeok', mean: '晚上', topic: '时间', ex: [{ ko: '저녁 먹었어요?', zh: '吃晚饭了吗？' }, { ko: '저녁에 공부해요.', zh: '晚上学习。' }] },
  { w: '주말', ph: 'ju-mal', mean: '周末', topic: '时间', ex: [{ ko: '주말에 쉬어요.', zh: '周末休息。' }, { ko: '주말 계획 있어요?', zh: '周末有安排吗？' }] },
  { w: '지금', ph: 'ji-geum', mean: '现在', topic: '时间', ex: [{ ko: '지금 바빠요.', zh: '现在很忙。' }, { ko: '지금 전화해요.', zh: '现在打电话。' }] },
  { w: '빨강', ph: 'ppal-gang', mean: '红色', topic: '颜色', ex: [{ ko: '빨강 색 좋아해요.', zh: '我喜欢红色。' }, { ko: '빨강 옷 입어요.', zh: '穿红色衣服。' }] },
  { w: '파랑', ph: 'pa-rang', mean: '蓝色', topic: '颜色', ex: [{ ko: '파랑 하늘이 예뻐요.', zh: '蓝天很美。' }, { ko: '파랑 펜 쓸래요?', zh: '用蓝色笔吗？' }] },
  { w: '노랑', ph: 'no-rang', mean: '黄色', topic: '颜色', ex: [{ ko: '노랑 꽃 예뻐요.', zh: '黄花好看。' }, { ko: '노랑을 고를래요.', zh: '选黄色。' }] },
  { w: '초록', ph: 'cho-rok', mean: '绿色', topic: '颜色', ex: [{ ko: '초록 나무 많아요.', zh: '绿树多。' }, { ko: '초록 좋아해요.', zh: '喜欢绿色。' }] },
  { w: '하양', ph: 'ha-yang', mean: '白色', topic: '颜色', ex: [{ ko: '하양 눈 와요.', zh: '下白雪。' }, { ko: '하양 셔츠 입어요.', zh: '穿白衬衫。' }] },
  { w: '검정', ph: 'geom-jeong', mean: '黑色', topic: '颜色', ex: [{ ko: '검정 고양이 있어요.', zh: '有黑猫。' }, { ko: '검정 멋져요.', zh: '黑色很酷。' }] },
  { w: '보라', ph: 'bo-ra', mean: '紫色', topic: '颜色', ex: [{ ko: '보라 꽃 예뻐요.', zh: '紫花漂亮。' }, { ko: '보라 색 마음에 들어요.', zh: '中意紫色。' }] },
  { w: '분홍', ph: 'bu-nong', mean: '粉色', topic: '颜色', ex: [{ ko: '분홍 옷 예뻐요.', zh: '粉衣好看。' }, { ko: '분홍 좋아해요.', zh: '喜欢粉色。' }] },
  { w: '가다', ph: 'ga-da', mean: '去', topic: '动词', ex: [{ ko: '학교에 가요.', zh: '去学校。' }, { ko: '같이 가요.', zh: '一起去。' }] },
  { w: '오다', ph: 'o-da', mean: '来', topic: '动词', ex: [{ ko: '언제 와요?', zh: '什么时候来？' }, { ko: '친구가 왔어요.', zh: '朋友来了。' }] },
  { w: '먹다', ph: 'meok-da', mean: '吃', topic: '动词', ex: [{ ko: '밥 먹어요.', zh: '吃饭。' }, { ko: '사과 먹을래요?', zh: '吃苹果吗？' }] },
  { w: '마시다', ph: 'ma-si-da', mean: '喝', topic: '动词', ex: [{ ko: '물 마셔요.', zh: '喝水。' }, { ko: '커피 마실래요?', zh: '喝咖啡吗？' }] },
  { w: '자다', ph: 'ja-da', mean: '睡', topic: '动词', ex: [{ ko: '일찍 자요.', zh: '早睡。' }, { ko: '잘 자요.', zh: '晚安（好好睡）。' }] },
  { w: '보다', ph: 'bo-da', mean: '看', topic: '动词', ex: [{ ko: '영화 봐요.', zh: '看电影。' }, { ko: '사진 봤어요?', zh: '看照片了吗？' }] },
  { w: '하다', ph: 'ha-da', mean: '做', topic: '动词', ex: [{ ko: '숙제 해요.', zh: '做作业。' }, { ko: '운동 할래요?', zh: '做运动吗？' }] },
  { w: '사랑하다', ph: 'sa-rang-ha-da', mean: '爱', topic: '动词', ex: [{ ko: '가족을 사랑해요.', zh: '爱家人。' }, { ko: '나라를 사랑해요.', zh: '爱国。' }] },
  { w: '머리', ph: 'meo-ri', mean: '头', topic: '身体', ex: [{ ko: '머리 아파요.', zh: '头疼。' }, { ko: '머리 감았어요.', zh: '洗头了。' }] },
  { w: '눈', ph: 'nun', mean: '眼睛', topic: '身体', ex: [{ ko: '눈이 예뻐요.', zh: '眼睛好看。' }, { ko: '눈 감아요.', zh: '闭上眼睛。' }] },
  { w: '귀', ph: 'gwi', mean: '耳朵', topic: '身体', ex: [{ ko: '귀가 들려요.', zh: '听得见（耳朵）。' }, { ko: '귀 깨끗해요.', zh: '耳朵干净。' }] },
  { w: '코', ph: 'ko', mean: '鼻子', topic: '身体', ex: [{ ko: '코가 커요.', zh: '鼻子大。' }, { ko: '코 막혔어요.', zh: '鼻塞了。' }] },
  { w: '입', ph: 'ip', mean: '嘴', topic: '身体', ex: [{ ko: '입 벌려요.', zh: '张开嘴。' }, { ko: '입 조심해요.', zh: '注意言辞。' }] },
  { w: '손', ph: 'son', mean: '手', topic: '身体', ex: [{ ko: '손 씻어요.', zh: '洗手。' }, { ko: '손 흔들어요.', zh: '挥手。' }] },
  { w: '발', ph: 'bal', mean: '脚', topic: '身体', ex: [{ ko: '발 아파요.', zh: '脚疼。' }, { ko: '발 씻어요.', zh: '洗脚。' }] },
  { w: '마음', ph: 'ma-eum', mean: '心', topic: '身体', ex: [{ ko: '마음이 따뜻해요.', zh: '心里很温暖。' }, { ko: '마음 편해요.', zh: '心里舒服。' }] },
  { w: '고양이', ph: 'go-yang-i', mean: '猫', topic: '动物', ex: [{ ko: '고양이 키워요.', zh: '养猫。' }, { ko: '고양이 귀여워요.', zh: '猫很可爱。' }] },
  { w: '강아지', ph: 'gang-a-ji', mean: '狗(小狗)', topic: '动物', ex: [{ ko: '강아지 귀여워요.', zh: '小狗可爱。' }, { ko: '강아지 산책시켜요.', zh: '遛狗。' }] },
  { w: '새', ph: 'sae', mean: '鸟', topic: '动物', ex: [{ ko: '새가 날아요.', zh: '鸟在飞。' }, { ko: '새 소리 들려요.', zh: '听见鸟叫。' }] },
  { w: '물고기', ph: 'mul-go-gi', mean: '鱼', topic: '动物', ex: [{ ko: '물고기 키워요.', zh: '养鱼。' }, { ko: '물고기 헤엄쳐요.', zh: '鱼在游。' }] },
  { w: '소', ph: 'so', mean: '牛', topic: '动物', ex: [{ ko: '소가 커요.', zh: '牛很大。' }, { ko: '소 우유 줘요.', zh: '牛产奶。' }] },
  { w: '돼지', ph: 'dwae-ji', mean: '猪', topic: '动物', ex: [{ ko: '돼지 귀여워요.', zh: '猪可爱。' }, { ko: '돼지 고기 맛있어요.', zh: '猪肉好吃。' }] },
  { w: '호랑이', ph: 'ho-rang-i', mean: '老虎', topic: '动物', ex: [{ ko: '호랑이 무서워요.', zh: '老虎可怕。' }, { ko: '호랑이 힘세요.', zh: '老虎有力气。' }] },
  { w: '토끼', ph: 'to-kki', mean: '兔子', topic: '动物', ex: [{ ko: '토끼 귀여워요.', zh: '兔子可爱。' }, { ko: '토끼 당근 좋아해요.', zh: '兔子喜欢胡萝卜。' }] }
];
/* ============ 日语主题词汇（8 大主题，每主题 8 词，共 64 词） ============ */
const JP_VOCAB = [
  { w: '一', ph: 'ichi', mean: '一', topic: '数字', ex: [{ ja: '一、二、三。', zh: '一、二、三。' }, { ja: 'りんごを一つください。', zh: '请给我一个苹果。' }] },
  { w: '二', ph: 'ni', mean: '二', topic: '数字', ex: [{ ja: '二人で行きます。', zh: '两个人一起去。' }, { ja: '二つ買います。', zh: '买两个。' }] },
  { w: '三', ph: 'san', mean: '三', topic: '数字', ex: [{ ja: '三つあります。', zh: '有三个。' }, { ja: '猫が三匹います。', zh: '有三只猫。' }] },
  { w: '四', ph: 'shi / yon', mean: '四', topic: '数字', ex: [{ ja: '四人きました。', zh: '来了四个人。' }, { ja: '四時です。', zh: '四点了。' }] },
  { w: '五', ph: 'go', mean: '五', topic: '数字', ex: [{ ja: '五冊買いました。', zh: '买了五本。' }, { ja: '五時に起きます。', zh: '五点起床。' }] },
  { w: '六', ph: 'roku', mean: '六', topic: '数字', ex: [{ ja: '六個あります。', zh: '有六个。' }, { ja: '六ヶ月です。', zh: '六个月大。' }] },
  { w: '七', ph: 'nana / shichi', mean: '七', topic: '数字', ex: [{ ja: '七時に起きます。', zh: '七点起床。' }, { ja: '七人です。', zh: '七个人。' }] },
  { w: '八', ph: 'hachi', mean: '八', topic: '数字', ex: [{ ja: '八時の映画。', zh: '八点的电影。' }, { ja: '八歳です。', zh: '八岁了。' }] },
  { w: 'りんご', ph: 'ringo', mean: '苹果', topic: '食物', ex: [{ ja: 'りんごが好きです。', zh: '我喜欢苹果。' }, { ja: 'りんごを一つください。', zh: '请给我一个苹果。' }] },
  { w: 'ご飯', ph: 'gohan', mean: '饭', topic: '食物', ex: [{ ja: 'ご飯を食べましたか。', zh: '吃饭了吗？' }, { ja: 'ご飯をたくさん食べてね。', zh: '多吃点饭。' }] },
  { w: '水', ph: 'mizu', mean: '水', topic: '食物', ex: [{ ja: '水を一杯ください。', zh: '请给我一杯水。' }, { ja: '水を飲みました。', zh: '喝水了。' }] },
  { w: 'パン', ph: 'pan', mean: '面包', topic: '食物', ex: [{ ja: 'パンを買ってきました。', zh: '买面包回来了。' }, { ja: '朝パンを食べます。', zh: '早上吃面包。' }] },
  { w: '肉', ph: 'niku', mean: '肉', topic: '食物', ex: [{ ja: '肉が好きです。', zh: '我喜欢吃肉。' }, { ja: '肉を焼きました。', zh: '烤了肉。' }] },
  { w: '魚', ph: 'sakana', mean: '鱼', topic: '食物', ex: [{ ja: '魚が好きです。', zh: '我喜欢鱼。' }, { ja: '魚を食べます。', zh: '吃鱼。' }] },
  { w: '野菜', ph: 'yasai', mean: '蔬菜', topic: '食物', ex: [{ ja: '野菜をたくさん食べます。', zh: '多吃蔬菜。' }, { ja: '野菜が新鮮です。', zh: '蔬菜很新鲜。' }] },
  { w: 'コーヒー', ph: 'ko-hi-', mean: '咖啡', topic: '食物', ex: [{ ja: 'コーヒーを飲みますか。', zh: '喝咖啡吗？' }, { ja: '朝のコーヒーは必須です。', zh: '早上必喝咖啡。' }] },
  { w: 'お母さん', ph: 'okaasan', mean: '妈妈', topic: '家庭', ex: [{ ja: 'お母さんが料理します。', zh: '妈妈做饭。' }, { ja: 'お母さんに会いたい。', zh: '想妈妈了。' }] },
  { w: 'お父さん', ph: 'otousan', mean: '爸爸', topic: '家庭', ex: [{ ja: 'お父さんに連絡しました。', zh: '联系爸爸了。' }, { ja: 'お父さんが笑いました。', zh: '爸爸笑了。' }] },
  { w: 'お姉さん', ph: 'oneesan', mean: '姐姐', topic: '家庭', ex: [{ ja: 'お姉さんが助けてくれた。', zh: '姐姐帮了我。' }, { ja: 'お姉さんに会いたい。', zh: '想姐姐了。' }] },
  { w: 'お兄さん', ph: 'oniisan', mean: '哥哥', topic: '家庭', ex: [{ ja: 'お兄さんが来ました。', zh: '哥哥来了。' }, { ja: 'お兄さんを信じます。', zh: '信哥哥的话。' }] },
  { w: '弟', ph: 'otouto', mean: '弟弟', topic: '家庭', ex: [{ ja: '弟がかわいいです。', zh: '弟弟很可爱。' }, { ja: '弟が学校へ行きます。', zh: '弟弟去上学。' }] },
  { w: '妹', ph: 'imouto', mean: '妹妹', topic: '家庭', ex: [{ ja: '妹がいます。', zh: '有妹妹。' }, { ja: '妹と話します。', zh: '和妹妹聊天。' }] },
  { w: 'お祖母さん', ph: 'obaasan', mean: '奶奶', topic: '家庭', ex: [{ ja: 'お祖母さんがいます。', zh: '奶奶在。' }, { ja: 'お祖母さんに挨拶します。', zh: '向奶奶问好。' }] },
  { w: '家族', ph: 'kazoku', mean: '家人', topic: '家庭', ex: [{ ja: '家族と一緒に住んでいます。', zh: '和家人一起住。' }, { ja: '家族が大切です。', zh: '家人很重要。' }] },
  { w: '今日', ph: 'kyou', mean: '今天', topic: '时间', ex: [{ ja: '今日はいい天気です。', zh: '今天天气好。' }, { ja: '今日は休みます。', zh: '今天休息。' }] },
  { w: '明日', ph: 'ashita', mean: '明天', topic: '时间', ex: [{ ja: '明日会いましょう。', zh: '明天见。' }, { ja: '明日試験があります。', zh: '明天有考试。' }] },
  { w: '昨日', ph: 'kinou', mean: '昨天', topic: '时间', ex: [{ ja: '昨日寝坊しました。', zh: '昨天睡懒觉了。' }, { ja: '昨日映画を見ました。', zh: '昨天看了电影。' }] },
  { w: '朝', ph: 'asa', mean: '早上', topic: '时间', ex: [{ ja: '朝ご飯を食べましたか。', zh: '吃早饭了吗？' }, { ja: '朝散歩します。', zh: '早上散步。' }] },
  { w: '昼', ph: 'hiru', mean: '中午', topic: '时间', ex: [{ ja: '昼何を食べますか。', zh: '午饭吃什么？' }, { ja: '昼ご飯を一緒に食べましょう。', zh: '一起吃午饭吧。' }] },
  { w: '夜', ph: 'yoru', mean: '晚上', topic: '时间', ex: [{ ja: '夜ご飯を食べましたか。', zh: '吃晚饭了吗？' }, { ja: '夜勉強します。', zh: '晚上学习。' }] },
  { w: '週末', ph: 'shuumatsu', mean: '周末', topic: '时间', ex: [{ ja: '週末は休みます。', zh: '周末休息。' }, { ja: '週末の予定はありますか。', zh: '周末有安排吗？' }] },
  { w: '今', ph: 'ima', mean: '现在', topic: '时间', ex: [{ ja: '今忙しいです。', zh: '现在很忙。' }, { ja: '今電話します。', zh: '现在打电话。' }] },
  { w: '赤', ph: 'aka', mean: '红色', topic: '颜色', ex: [{ ja: '赤が好きです。', zh: '我喜欢红色。' }, { ja: '赤い服を着ます。', zh: '穿红色衣服。' }] },
  { w: '青', ph: 'ao', mean: '蓝色', topic: '颜色', ex: [{ ja: '青い空がきれいです。', zh: '蓝天很美。' }, { ja: '青いペンを使いますか。', zh: '用蓝色笔吗？' }] },
  { w: '黄色', ph: 'kiiro', mean: '黄色', topic: '颜色', ex: [{ ja: '黄色い花がきれいです。', zh: '黄花好看。' }, { ja: '黄色を選びます。', zh: '选黄色。' }] },
  { w: '緑', ph: 'midori', mean: '绿色', topic: '颜色', ex: [{ ja: '緑の木が多いです。', zh: '绿树多。' }, { ja: '緑が好きです。', zh: '喜欢绿色。' }] },
  { w: '白', ph: 'shiro', mean: '白色', topic: '颜色', ex: [{ ja: '白い雪が降ります。', zh: '下白雪。' }, { ja: '白いシャツを着ます。', zh: '穿白衬衫。' }] },
  { w: '黒', ph: 'kuro', mean: '黑色', topic: '颜色', ex: [{ ja: '黒い猫がいます。', zh: '有黑猫。' }, { ja: '黒がかっこいいです。', zh: '黑色很酷。' }] },
  { w: '紫', ph: 'murasaki', mean: '紫色', topic: '颜色', ex: [{ ja: '紫の花がきれいです。', zh: '紫花漂亮。' }, { ja: '紫が気に入りました。', zh: '中意紫色。' }] },
  { w: 'ピンク', ph: 'pinku', mean: '粉色', topic: '颜色', ex: [{ ja: 'ピンクの服がきれいです。', zh: '粉衣好看。' }, { ja: 'ピンクが好きです。', zh: '喜欢粉色。' }] },
  { w: '行く', ph: 'iku', mean: '去', topic: '动词', ex: [{ ja: '学校へ行きます。', zh: '去学校。' }, { ja: '一緒に行きましょう。', zh: '一起去。' }] },
  { w: '来る', ph: 'kuru', mean: '来', topic: '动词', ex: [{ ja: 'いつ来ますか。', zh: '什么时候来？' }, { ja: '友達が来ました。', zh: '朋友来了。' }] },
  { w: '食べる', ph: 'taberu', mean: '吃', topic: '动词', ex: [{ ja: 'ご飯を食べます。', zh: '吃饭。' }, { ja: 'りんごを食べますか。', zh: '吃苹果吗？' }] },
  { w: '飲む', ph: 'nomu', mean: '喝', topic: '动词', ex: [{ ja: '水を飲みます。', zh: '喝水。' }, { ja: 'コーヒーを飲みますか。', zh: '喝咖啡吗？' }] },
  { w: '寝る', ph: 'neru', mean: '睡', topic: '动词', ex: [{ ja: '早く寝ます。', zh: '早睡。' }, { ja: 'おやすみなさい。', zh: '晚安（好好睡）。' }] },
  { w: '見る', ph: 'miru', mean: '看', topic: '动词', ex: [{ ja: '映画を見ます。', zh: '看电影。' }, { ja: '写真を見ましたか。', zh: '看照片了吗？' }] },
  { w: 'する', ph: 'suru', mean: '做', topic: '动词', ex: [{ ja: '宿題をします。', zh: '做作业。' }, { ja: '運動をしますか。', zh: '做运动吗？' }] },
  { w: '愛する', ph: 'aisuru', mean: '爱', topic: '动词', ex: [{ ja: '家族を愛しています。', zh: '爱家人。' }, { ja: '国を愛しています。', zh: '爱国。' }] },
  { w: '頭', ph: 'atama', mean: '头', topic: '身体', ex: [{ ja: '頭が痛いです。', zh: '头疼。' }, { ja: '頭を洗いました。', zh: '洗头了。' }] },
  { w: '目', ph: 'me', mean: '眼睛', topic: '身体', ex: [{ ja: '目がきれいです。', zh: '眼睛好看。' }, { ja: '目を閉じてください。', zh: '闭上眼睛。' }] },
  { w: '耳', ph: 'mimi', mean: '耳朵', topic: '身体', ex: [{ ja: '耳が聞こえます。', zh: '听得见（耳朵）。' }, { ja: '耳がきれいです。', zh: '耳朵干净。' }] },
  { w: '鼻', ph: 'hana', mean: '鼻子', topic: '身体', ex: [{ ja: '鼻が大きいです。', zh: '鼻子大。' }, { ja: '鼻が詰まっています。', zh: '鼻塞了。' }] },
  { w: '口', ph: 'kuchi', mean: '嘴', topic: '身体', ex: [{ ja: '口を開けてください。', zh: '张开嘴。' }, { ja: '口に気をつけて。', zh: '注意言辞。' }] },
  { w: '手', ph: 'te', mean: '手', topic: '身体', ex: [{ ja: '手を洗います。', zh: '洗手。' }, { ja: '手を振ります。', zh: '挥手。' }] },
  { w: '足', ph: 'ashi', mean: '脚/腿', topic: '身体', ex: [{ ja: '足が痛いです。', zh: '脚疼。' }, { ja: '足を洗います。', zh: '洗脚。' }] },
  { w: '心', ph: 'kokoro', mean: '心', topic: '身体', ex: [{ ja: '心が温かいです。', zh: '心里很温暖。' }, { ja: '心が落ち着きます。', zh: '心里舒服。' }] },
  { w: '猫', ph: 'neko', mean: '猫', topic: '动物', ex: [{ ja: '猫を飼っています。', zh: '养猫。' }, { ja: '猫がかわいいです。', zh: '猫很可爱。' }] },
  { w: '犬', ph: 'inu', mean: '狗', topic: '动物', ex: [{ ja: '犬がかわいいです。', zh: '狗可爱。' }, { ja: '犬の散歩をします。', zh: '遛狗。' }] },
  { w: '鳥', ph: 'tori', mean: '鸟', topic: '动物', ex: [{ ja: '鳥が飛んでいます。', zh: '鸟在飞。' }, { ja: '鳥の声が聞こえます。', zh: '听见鸟叫。' }] },
  { w: '馬', ph: 'uma', mean: '马', topic: '动物', ex: [{ ja: '馬が走ります。', zh: '马在跑。' }, { ja: '馬に乗りました。', zh: '骑过马。' }] },
  { w: '牛', ph: 'ushi', mean: '牛', topic: '动物', ex: [{ ja: '牛が大きいです。', zh: '牛很大。' }, { ja: '牛はミルクを出します。', zh: '牛产奶。' }] },
  { w: '豚', ph: 'buta', mean: '猪', topic: '动物', ex: [{ ja: '豚がかわいいです。', zh: '猪可爱。' }, { ja: '豚肉がおいしいです。', zh: '猪肉好吃。' }] },
  { w: '虎', ph: 'tora', mean: '老虎', topic: '动物', ex: [{ ja: '虎が怖いです。', zh: '老虎可怕。' }, { ja: '虎は強いです。', zh: '老虎有力气。' }] },
  { w: '兎', ph: 'usagi', mean: '兔子', topic: '动物', ex: [{ ja: '兎がかわいいです。', zh: '兔子可爱。' }, { ja: '兎は人参が好きです。', zh: '兔子喜欢胡萝卜。' }] }
];
/* ============ 通用词汇引擎（韩语/日语主题词库，复用英语艾宾浩斯机制） ============ */
const KR_VCFG = { stateKey: 'krVocabRec', learnedKey: 'krVocabLearned', wrongKey: 'krVocabWrong', ckKey: 'krVocabCk', lang: 'ko-KR', exField: 'ko' };
const JP_VCFG = { stateKey: 'jpVocabRec', learnedKey: 'jpVocabLearned', wrongKey: 'jpVocabWrong', ckKey: 'jpVocabCk', lang: 'ja-JP', exField: 'ja' };
const VOCAB_SRC = { KR_VOCAB: KR_VOCAB, JP_VOCAB: JP_VOCAB, MY_KR: () => store.g('myKrVocab', []), MY_JP: () => store.g('myJpVocab', []), MY_EN: () => store.g('myEnVocab', []) };
function getSrc(name) { const s = VOCAB_SRC[name]; return typeof s === 'function' ? s() : s; }
const MY_KR_CFG = { stateKey: 'myKrVocabRec', learnedKey: 'myKrVocabLearned', wrongKey: 'myKrVocabWrong', ckKey: 'myKrVocabCk', lang: 'ko-KR', exField: 'ko' };
const MY_JP_CFG = { stateKey: 'myJpVocabRec', learnedKey: 'myJpVocabLearned', wrongKey: 'myJpVocabWrong', ckKey: 'myJpVocabCk', lang: 'ja-JP', exField: 'ja' };
const MY_EN_CFG = { stateKey: 'myEnVocabRec', learnedKey: 'myEnVocabLearned', wrongKey: 'myEnVocabWrong', ckKey: 'myEnVocabCk', lang: 'en-US', exField: 'en' };

/* ===== 主题词包（预置，可一键加载进「我的词库」） ===== */
/* 每条 [单词, 音标, 释义, 例句1(外文), 例句1中文, 例句2(外文), 例句2中文] */
const VOCAB_PACKS = {
  'ko-KR': {
    '点餐食物': [
      ['김치','kimchi','泡菜','김치가 매워요.','泡菜很辣。','김치를 좋아해요.','我喜欢泡菜。'],
      ['밥','bap','饭；米饭','밥 먹었어요?','吃饭了吗？','밥이 맛있어요.','饭很好吃。'],
      ['국','guk','汤','국을 마셔요.','喝汤。','이 국은 시원해요.','这汤很清爽。'],
      ['불고기','bulgogi','烤肉','불고기를 먹어요.','吃烤肉。','불고기가 맛있어요.','烤肉好吃。'],
      ['라면','ramyeon','拉面','라면을 끓여요.','煮拉面。','라면이 배부르게 해요.','拉面让人吃饱。'],
      ['떡볶이','tteokbokki','炒年糕','떡볶이가 매워요.','炒年糕很辣。','떡볶이를 사요.','买炒年糕。'],
      ['삼겹살','samgyeopsal','五花肉','삼겹살을 구워요.','烤五花肉。','삼겹살 맛집 가요.','去五花肉名店。'],
      ['계란','gyeran','鸡蛋','계란을 삶아요.','煮鸡蛋。','계란이 필요해요.','需要鸡蛋。'],
      ['물','mul','水','물 주세요.','请给我水。','물이 차가워요.','水很凉。'],
      ['커피','keopi','咖啡','커피 마실래요?','喝咖啡吗？','커피를 사요.','买咖啡。'],
      ['빵','ppang','面包','빵을 사요.','买面包。','빵이 부드러워요.','面包很软。'],
      ['숟가락','sutgarak','勺子','숟가락을 써요.','用勺子。','숟가락이 필요해요.','需要勺子。']
    ],
    '出行问路': [
      ['공항','gonghang','机场','공항에 가요.','去机场。','공항이 멀어요.','机场很远。'],
      ['역','yeok','车站','역에서 만나요.','在车站见面。','역이 어디예요?','车站在哪儿？'],
      ['버스','beoseu','公交车','버스를 타요.','坐公交。','버스가 늦어요.','公交晚点。'],
      ['지하철','jihacheol','地铁','지하철을 타요.','坐地铁。','지하철이 빨라요.','地铁很快。'],
      ['택시','taeksi','出租车','택시를 불러요.','叫出租。','택시가 왔어요.','出租车来了。'],
      ['길','gil','路','길을 잃었어요.','迷路了。','이 길로 가요.','走这条路。'],
      ['오른쪽','oreunjjok','右边','오른쪽으로 가요.','向右走。','오른쪽에 있어요.','在右边。'],
      ['왼쪽','oenjjok','左边','왼쪽으로 돌아요.','向左转。','왼쪽에 있어요.','在左边。'],
      ['직진','jikjin','直走','직진하세요.','请直走。','직진하면 돼요.','直走就行。'],
      ['근처','geuncheo','附近','근처에 있어요.','在附近。','근처에 은행 있어요?','附近有银行吗？'],
      ['지도','jido','地图','지도를 봐요.','看地图。','지도가 필요해요.','需要地图。'],
      ['호텔','hoteri','酒店','호텔에 머물러요.','住在酒店。','호텔이 깨끗해요.','酒店很干净。']
    ],
    '购物': [
      ['가게','gage','商店','가게에 가요.','去商店。','가게가 커요.','商店很大。'],
      ['시장','sijang','市场','시장에 가요.','去市场。','시장이 붐벼요.','市场很热闹。'],
      ['백화점','baekhwajeom','百货店','백화점에 가요.','去百货店。','백화점이 멋있어요.','百货店很漂亮。'],
      ['옷','ot','衣服','옷을 사요.','买衣服。','옷이 예뻐요.','衣服好看。'],
      ['신발','sinbal','鞋子','신발을 신어요.','穿鞋。','신발이 편해요.','鞋子舒服。'],
      ['가격','gagyeok','价格','가격이 얼마예요?','价格多少？','가격이 비싸요.','价格贵。'],
      ['할인','halin','折扣','할인해 주세요.','请打折。','할인 중이에요.','正在打折。'],
      ['카드','kadeu','卡','카드로 낼게요.','用卡付。','카드를 써요.','用卡。'],
      ['돈','don','钱','돈이 없어요.','没钱。','돈을 내요.','付钱。'],
      ['쇼핑','syoping','购物','쇼핑해요.','购物。','쇼핑이 좋아요.','喜欢购物。'],
      ['바구니','baguni','篮子；购物车','바구니에 담아요.','放进篮子。','바구니가 가벼워요.','篮子很轻。'],
      ['영수증','yeongsujeung','发票','영수증 주세요.','请给发票。','영수증을 받아요.','收到发票。']
    ],
    '居家生活': [
      ['집','jip','家','집에 가요.','回家。','집이 따뜻해요.','家很温暖。'],
      ['방','bang','房间','방이 커요.','房间大。','방을 청소해요.','打扫房间。'],
      ['부엌','bueok','厨房','부엌에서 요리해요.','在厨房做饭。','부엌이 깨끗해요.','厨房干净。'],
      ['침대','chimdae','床','침대에서 자요.','在床上睡。','침대가 편해요.','床很舒服。'],
      ['문','mun','门','문을 닫아요.','关门。','문이 열려 있어요.','门开着。'],
      ['창문','changmun','窗户','창문을 열어요.','开窗。','창문이 커요.','窗户大。'],
      ['쓰레기','sseuregi','垃圾','쓰레기를 버려요.','扔垃圾。','쓰레기를 치워요.','收拾垃圾。'],
      ['빗자루','bitjaru','扫帚','빗자루로 쓸어요.','用扫帚扫。','빗자루가 있어요.','有扫帚。'],
      ['텔레비전','tellebijeon','电视','텔레비전을 봐요.','看电视。','텔레비전이 커요.','电视大。'],
      ['냉장고','naengjanggo','冰箱','냉장고를 열어요.','开冰箱。','냉장고가 차가워요.','冰箱很凉。'],
      ['세탁기','setakgi','洗衣机','세탁기를 돌려요.','开洗衣机。','세탁기가 고장났어요.','洗衣机坏了。'],
      ['전등','jeondeung','灯','전등을 켜요.','开灯。','전등이 꺼져 있어요.','灯关着。']
    ],
    '工作学习': [
      ['회사','hoesa','公司','회사에 가요.','去公司。','회사가 멀어요.','公司远。'],
      ['사무실','samusil','办公室','사무실에서 일해요.','在办公室工作。','사무실이 조용해요.','办公室安静。'],
      ['일','il','工作','일을 해요.','工作。','일이 많아요.','工作多。'],
      ['회의','hoeui','会议','회의가 있어요.','有会议。','회의를 해요.','开会。'],
      ['컴퓨터','keompyuteo','电脑','컴퓨터를 써요.','用电脑。','컴퓨터가 느려요.','电脑慢。'],
      ['책','chaek','书','책을 읽어요.','读书。','책이 두꺼워요.','书很厚。'],
      ['공부','gongbu','学习','공부해요.','学习。','공부가 중요해요.','学习重要。'],
      ['시험','siheom','考试','시험이 있어요.','有考试。','시험을 봐요.','参加考试。'],
      ['선생님','seonsaengnim','老师','선생님이 가르쳐요.','老师教。','선생님이 친절해요.','老师很亲切。'],
      ['친구','chingu','朋友','친구를 만나요.','见朋友。','친구가 많아요.','朋友多。'],
      ['메모','memo','笔记','메모해요.','记笔记。','메모를 해요.','做笔记。'],
      ['이메일','imeil','邮件','이메일을 보내요.','发邮件。','이메일이 왔어요.','邮件来了。']
    ],
    '情绪感受': [
      ['기쁘다','kippeuda','开心','기뻐요.','很开心。','기분이 좋아요.','心情好。' ],
      ['슬프다','seulpeuda','悲伤','슬퍼요.','很悲伤。','슬픈 영화예요.','是悲伤的电影。'],
      ['화나다','hwanada','生气','화나요.','生气。','화가 났어요.','发火了。'],
      ['무섭다','museopda','害怕','무서워요.','害怕。','무서운 영화예요.','是恐怖电影。'],
      ['피곤하다','pigonhada','累','피곤해요.','累。','너무 피곤해요.','太累了。'],
      ['배고프다','baegopeuda','饿','배고파요.','饿。','배고파 죽겠어요.','饿死了。'],
      ['목마르다','mongmaruda','渴','목말라요.','渴。','물이 마시고 싶어요.','想喝水。'],
      ['심심하다','simsimhada','无聊','심심해요.','无聊。','심심할 때 뭐 해요?','无聊时做什么？'],
      ['부끄럽다','bukkeureopda','害羞','부끄러워요.','害羞。','부끄러운 거예요.','是害羞的事。'],
      ['놀랍다','nollapda','惊讶','놀라워요.','惊讶。','놀라운 소식이에요.','是惊人的消息。'],
      ['고맙다','gomabda','感激','고마워요.','感谢。','도와줘서 고마워요.','谢谢你帮忙。'],
      ['행복하다','haengbokhada','幸福','행복해요.','幸福。','행복한 하루예요.','幸福的一天。']
    ],
    '天气自然': [
      ['하늘','haneul','天空','하늘이 파래요.','天空蓝。','하늘이 맑아요.','天空晴朗。'],
      ['비','bi','雨','비가 와요.','下雨。','비가 많이 와요.','下大雨。'],
      ['눈','nun','雪','눈이 와요.','下雪。','눈이 예뻐요.','雪很美。'],
      ['바람','baram','风','바람이 불어요.','刮风。','바람이 세요.','风大。'],
      ['해','hae','太阳','해가 떠요.','太阳升起。','해가 따뜻해요.','太阳温暖。'],
      ['구름','gureum','云','구름이 많아요.','云多。','구름이 흰색이에요.','云是白色的。'],
      ['별','byeol','星星','별이 빛나요.','星星闪烁。','별을 봐요.','看星星。'],
      ['달','dal','月亮','달이 떠요.','月亮升起。','달이 둥글어요.','月亮圆。'],
      ['꽃','kkot','花','꽃이 피어요.','花开。','꽃이 예뻐요.','花好看。'],
      ['나무','namu','树','나무가 커요.','树很大。','나무를 심어요.','种树。'],
      ['강','gang','江；河','강이 흐르요.','河流淌。','강이 맑아요.','河水清。'],
      ['바다','bada','海','바다에 가요.','去海边。','바다가 넓어요.','海很宽广。']
    ],
    '数字时间': [
      ['하나','hana','一','하나만 주세요.','请给一个。','하루에 하나씩.','一天一个。'],
      ['둘','dul','二','둘 있어요.','有两个。','둘이 먹어요.','两个人吃。'],
      ['셋','set','三','셋이 모여요.','三人聚。','셋을 세요.','数到三。'],
      ['열','yeol','十','열 개 있어요.','有十个。','열 시예요.','十点了。'],
      ['백','baek','百','백 원이에요.','一百元。','백 명이 왔어요.','来了一百人。'],
      ['천','cheon','千','천 원이에요.','一千元。','천 권이에요.','一千本。'],
      ['시','si','点(时)','몇 시예요?','几点了？','세 시예요.','三点。'],
      ['분','bun','分','십 분이에요.','十分。','오 분 기다려요.','等五分钟。'],
      ['오늘','oneul','今天','오늘 뭐 해요?','今天做什么？','오늘 쉬어요.','今天休息。'],
      ['내일','naeil','明天','내일 만나요.','明天见。','내일 시험이에요.','明天考试。'],
      ['어제','eoje','昨天','어제 갔어요.','昨天去了。','어제 비가 왔어요.','昨天下雨了。'],
      ['주말','jumal','周末','주말에 가요.','周末去。','주말이 좋아요.','喜欢周末。']
    ]
  },
  'ja-JP': {
    '点餐食物': [
      ['ご飯','gohan','米饭','ご飯を食べます。','吃饭。','ご飯がおいしいです。','饭很好吃。'],
      ['味噌汁','misoshiru','味噌汤','味噌汁を飲みます。','喝味噌汤。','味噌汁が温かいです。','味噌汤很暖。'],
      ['寿司','sushi','寿司','寿司を食べます。','吃寿司。','寿司が好きです。','喜欢寿司。'],
      ['ラーメン','raamen','拉面','ラーメンを食べます。','吃拉面。','ラーメンがおいしいです。','拉面好吃。'],
      ['肉','niku','肉','肉を焼きます。','烤肉。','肉が柔らかいです。','肉很嫩。'],
      ['魚','sakana','鱼','魚を食べます。','吃鱼。','魚が泳いでいます。','鱼在游。'],
      ['野菜','yasai','蔬菜','野菜を食べます。','吃蔬菜。','野菜が新鮮です。','蔬菜新鲜。'],
      ['卵','tamago','鸡蛋','卵を茹でます。','煮鸡蛋。','卵が必要です。','需要鸡蛋。'],
      ['水','mizu','水','水をください。','请给我水。','水が冷たいです。','水很凉。'],
      ['お茶','ocha','茶','お茶を飲みます。','喝茶。','お茶が好きです。','喜欢茶。'],
      ['パン','pan','面包','パンを買います。','买面包。','パンが柔らかいです。','面包很软。'],
      ['スプーン','supuun','勺子','スプーンを使います。','用勺子。','スプーンが必要です。','需要勺子。']
    ],
    '出行问路': [
      ['空港','kuukou','机场','空港に行きます。','去机场。','空港は遠いです。','机场很远。'],
      ['駅','eki','车站','駅で会います。','在车站见面。','駅はどこですか。','车站在哪儿？'],
      ['バス','basu','公交车','バスに乗ります。','坐公交。','バスが遅いです。','公交晚点。'],
      ['電車','densha','电车；地铁','電車に乗ります。','坐电车。','電車が速いです。','电车很快。'],
      ['タクシー','takushii','出租车','タクシーを呼びます。','叫出租。','タクシーが来ました。','出租车来了。'],
      ['道','michi','路','道に迷いました。','迷路了。','この道を行きます。','走这条路。'],
      ['右','migi','右','右に行きます。','向右走。','右にあります。','在右边。'],
      ['左','hidari','左','左に曲がります。','向左转。','左にあります。','在左边。'],
      ['まっすぐ','massugu','直走','まっすぐ行ってください。','请直走。','まっすぐで大丈夫です。','直走就行。'],
      ['近く','chikaku','附近','近くにあります。','在附近。','近くに銀行がありますか。','附近有银行吗？'],
      ['地図','chizu','地图','地図を見ます。','看地图。','地図が必要です。','需要地图。'],
      ['ホテル','hoteru','酒店','ホテルに泊まります。','住在酒店。','ホテルがきれいです。','酒店很干净。']
    ],
    '购物': [
      ['店','mise','店','店に行きます。','去商店。','店が大きいです。','店很大。'],
      ['市場','ichiba','市场','市場に行きます。','去市场。','市場がにぎやかです。','市场很热闹。'],
      ['デパート','depaato','百货店','デパートに行きます。','去百货店。','デパートが素敵です。','百货店漂亮。'],
      ['服','fuku','衣服','服を買います。','买衣服。','服がきれいです。','衣服好看。'],
      ['靴','kutsu','鞋子','靴を履きます。','穿鞋。','靴が楽です。','鞋子舒服。'],
      ['値段','nedan','价格','値段はいくらですか。','价格多少？','値段が高いです。','价格贵。'],
      ['割引','waribiki','折扣','割引してください。','请打折。','割引中です。','正在打折。'],
      ['カード','kaado','卡','カードで払います。','用卡付。','カードを使います。','用卡。'],
      ['お金','okane','钱','お金がありません。','没钱。','お金を払います。','付钱。'],
      ['買い物','kaimono','购物','買い物をします。','购物。','買い物が好きです。','喜欢购物。'],
      ['カゴ','kago','篮子','カゴに入れます。','放进篮子。','カゴが軽いです。','篮子很轻。'],
      ['レシート','reshiito','发票','レシートをください。','请给发票。','レシートを受け取ります。','收到发票。']
    ],
    '居家生活': [
      ['家','ie','家','家に帰ります。','回家。','家が暖かいです。','家很温暖。'],
      ['部屋','heya','房间','部屋が広いです。','房间大。','部屋を掃除します。','打扫房间。'],
      ['台所','daidokoro','厨房','台所で料理します。','在厨房做饭。','台所がきれいです。','厨房干净。'],
      ['ベッド','beddo','床','ベッドで寝ます。','在床上睡。','ベッドが快適です。','床很舒服。'],
      ['ドア','doa','门','ドアを閉めます。','关门。','ドアが開いています。','门开着。'],
      ['窓','mado','窗户','窓を開けます。','开窗。','窓が大きいです。','窗户大。'],
      ['ゴミ','gomi','垃圾','ゴミを捨てます。','扔垃圾。','ゴミを片付けます。','收拾垃圾。'],
      ['ほうき','houki','扫帚','ほうきで掃きます。','用扫帚扫。','ほうきがあります。','有扫帚。'],
      ['テレビ','terebi','电视','テレビを見ます。','看电视。','テレビが大きいです。','电视大。'],
      ['冷蔵庫','reizouko','冰箱','冷蔵庫を開けます。','开冰箱。','冷蔵庫が冷たいです。','冰箱很凉。'],
      ['洗濯機','sentakuki','洗衣机','洗濯機を回します。','开洗衣机。','洗濯機が壊れました。','洗衣机坏了。'],
      ['電気','denki','灯','電気をつけます。','开灯。','電気が消えています。','灯关着。']
    ],
    '工作学习': [
      ['会社','kaisha','公司','会社に行きます。','去公司。','会社は遠いです。','公司远。'],
      ['事務所','jimusho','办公室','事務所で働きます。','在办公室工作。','事務所が静かです。','办公室安静。'],
      ['仕事','shigoto','工作','仕事をします。','工作。','仕事が多いです。','工作多。'],
      ['会議','kaigi','会议','会議があります。','有会议。','会議をします。','开会。'],
      ['パソコン','pasokon','电脑','パソコンを使います。','用电脑。','パソコンが遅いです。','电脑慢。'],
      ['本','hon','书','本を読みます。','读书。','本が分厚いです。','书很厚。'],
      ['勉強','benkyou','学习','勉強します。','学习。','勉強が大事です。','学习重要。'],
      ['試験','shiken','考试','試験があります。','有考试。','試験を受けます。','参加考试。'],
      ['先生','sensei','老师','先生が教えます。','老师教。','先生が親切です。','老师很亲切。'],
      ['友達','tomodachi','朋友','友達に会います。','见朋友。','友達が多いです。','朋友多。'],
      ['メモ','memo','笔记','メモします。','记笔记。','メモを取ります。','做笔记。'],
      ['メール','meeru','邮件','メールを送ります。','发邮件。','メールが来ました。','邮件来了。']
    ],
    '情绪感受': [
      ['嬉しい','ureshii','开心','嬉しいです。','很开心。','気分がいいです。','心情好。'],
      ['悲しい','kanashii','悲伤','悲しいです。','很悲伤。','悲しい映画です。','是悲伤的电影。'],
      ['怒る','okoru','生气','怒っています。','生气。','怒りました。','发火了。'],
      ['怖い','kowai','害怕','怖いです。','害怕。','怖い映画です。','是恐怖电影。'],
      ['疲れた','tsukareta','累','疲れました。','累。','とても疲れました。','太累了。'],
      ['腹減った','haragetta','饿','お腹が空きました。','饿。','お腹が空いて死にそう。','饿死了。'],
      ['喉渇いた','nodokaita','渴','喉が渇きました。','渴。','水が飲みたいです。','想喝水。'],
      ['退屈','taikutsu','无聊','退屈です。','无聊。','退屈な時何しますか。','无聊时做什么？'],
      ['恥ずかしい','hazukashii','害羞','恥ずかしいです。','害羞。','恥ずかしいことです。','是害羞的事。'],
      ['驚いた','odoroita','惊讶','驚きました。','惊讶。','驚くべき知らせです。','是惊人的消息。'],
      ['感謝','kansha','感激','感謝します。','感谢。','助けてくれて感謝です。','谢谢你帮忙。'],
      ['幸せ','shiawase','幸福','幸せです。','幸福。','幸せな一日です。','幸福的一天。']
    ],
    '天气自然': [
      ['空','sora','天空','空が青いです。','天空蓝。','空が晴れています。','天空晴朗。'],
      ['雨','ame','雨','雨が降ります。','下雨。','雨がたくさん降ります。','下大雨。'],
      ['雪','yuki','雪','雪が降ります。','下雪。','雪がきれいです。','雪很美。'],
      ['風','kaze','风','風が吹きます。','刮风。','風が強いです。','风大。'],
      ['太陽','taiyou','太阳','太陽が昇ります。','太阳升起。','太陽が温かいです。','太阳温暖。'],
      ['雲','kumo','云','雲が多いです。','云多。','雲が白いです。','云是白色的。'],
      ['星','hoshi','星星','星が輝きます。','星星闪烁。','星を見ます。','看星星。'],
      ['月','tsuki','月亮','月が昇ります。','月亮升起。','月が丸いです。','月亮圆。'],
      ['花','hana','花','花が咲きます。','花开。','花がきれいです。','花好看。'],
      ['木','ki','树','木が大きいです。','树很大。','木を植えます。','种树。'],
      ['川','kawa','江；河','川が流れます。','河流淌。','川がきれいです。','河水清。'],
      ['海','umi','海','海に行きます。','去海边。','海が広いです。','海很宽广。']
    ],
    '数字时间': [
      ['一','ichi','一','一つください。','请给一个。','一日に一つずつ。','一天一个。'],
      ['二','ni','二','二つあります。','有两个。','二人で食べます。','两个人吃。'],
      ['三','san','三','三人集まります。','三人聚。','三を数えます。','数到三。'],
      ['十','juu','十','十冊あります。','有十本。','十時です。','十点了。'],
      ['百','hyaku','百','百円です。','一百元。','百人来ました。','来了一百人。'],
      ['千','sen','千','千円です。','一千元。','千冊です。','一千本。'],
      ['時','ji','点(时)','何時ですか。','几点了？','三時です。','三点。'],
      ['分','fun','分','十分です。','十分。','五分待ちます。','等五分钟。'],
      ['今日','kyou','今天','今日は何をしますか。','今天做什么？','今日は休みます。','今天休息。'],
      ['明日','ashita','明天','明日会います。','明天见。','明日試験です。','明天考试。'],
      ['昨日','kinou','昨天','昨日行きました。','昨天去了。','昨日雨が降りました。','昨天下雨了。'],
      ['週末','shuumatsu','周末','週末に行きます。','周末去。','週末が好きです。','喜欢周末。']
    ]
  },
  'en-US': {
    '点餐食物': [
      ['rice','/raɪs/','米饭','This is rice.','这是米饭。','Rice is a staple food.','米饭是主食。'],
      ['soup','/suːp/','汤','I drink soup.','我喝汤。','The soup is hot.','汤很烫。'],
      ['noodle','/ˈnuːdl/','面条','I eat noodles.','我吃面。','Noodles are tasty.','面条好吃。'],
      ['meat','/miːt/','肉','I cook meat.','我烤肉。','Meat is tender.','肉很嫩。'],
      ['fish','/fɪʃ/','鱼','I eat fish.','我吃鱼。','Fish swims.','鱼在游。'],
      ['vegetable','/ˈvedʒtəbl/','蔬菜','I eat vegetables.','我吃蔬菜。','Vegetables are fresh.','蔬菜新鲜。'],
      ['egg','/eɡ/','鸡蛋','I boil an egg.','我煮鸡蛋。','I need eggs.','我需要鸡蛋。'],
      ['water','/ˈwɔːtər/','水','Give me water.','请给我水。','Water is cold.','水很凉。'],
      ['tea','/tiː/','茶','I drink tea.','我喝茶。','I like tea.','我喜欢茶。'],
      ['bread','/bred/','面包','I buy bread.','我买面包。','Bread is soft.','面包很软。'],
      ['coffee','/ˈkɒfi/','咖啡','Want coffee?','要咖啡吗？','I buy coffee.','我买咖啡。'],
      ['spoon','/spuːn/','勺子','Use a spoon.','用勺子。','I need a spoon.','我需要勺子。']
    ],
    '出行问路': [
      ['airport','/ˈeəpɔːt/','机场','Go to the airport.','去机场。','The airport is far.','机场很远。'],
      ['bus','/bʌs/','公交车','Take the bus.','坐公交。','The bus is late.','公交晚点。'],
      ['subway','/ˈsʌbweɪ/','地铁','Take the subway.','坐地铁。','The subway is fast.','地铁很快。'],
      ['taxi','/ˈtæksi/','出租车','Call a taxi.','叫出租。','The taxi arrived.','出租车来了。'],
      ['road','/rəʊd/','路','I lost the road.','我迷路了。','Go this road.','走这条路。'],
      ['right','/raɪt/','右','Go right.','向右走。','It is on the right.','在右边。'],
      ['left','/left/','左','Turn left.','向左转。','It is on the left.','在左边。'],
      ['straight','/streɪt/','直走','Go straight.','请直走。','Straight is fine.','直走就行。'],
      ['near','/nɪər/','附近','It is near.','在附近。','Is there a bank near?','附近有银行吗？'],
      ['map','/mæp/','地图','Read the map.','看地图。','I need a map.','我需要地图。'],
      ['hotel','/həʊˈtel/','酒店','Stay at a hotel.','住在酒店。','The hotel is clean.','酒店很干净。']
    ],
    '购物': [
      ['shop','/ʃɒp/','商店','Go to the shop.','去商店。','The shop is big.','商店很大。'],
      ['market','/ˈmɑːkɪt/','市场','Go to the market.','去市场。','The market is busy.','市场很热闹。'],
      ['mall','/mɔːl/','商场','Go to the mall.','去商场。','The mall is nice.','商场漂亮。'],
      ['clothes','/kləʊðz/','衣服','Buy clothes.','买衣服。','The clothes are pretty.','衣服好看。'],
      ['shoes','/ʃuːz/','鞋子','Wear shoes.','穿鞋。','The shoes are comfy.','鞋子舒服。'],
      ['price','/praɪs/','价格','What is the price?','价格多少？','The price is high.','价格贵。'],
      ['discount','/ˈdɪskaʊnt/','折扣','Give a discount.','请打折。','It is on discount.','正在打折。'],
      ['card','/kɑːd/','卡','Pay by card.','用卡付。','I use a card.','我用卡。'],
      ['money','/ˈmʌni/','钱','No money.','没钱。','Pay the money.','付钱。'],
      ['shopping','/ˈʃɒpɪŋ/','购物','Go shopping.','去购物。','I like shopping.','我喜欢购物。'],
      ['basket','/ˈbɑːskɪt/','篮子','Put in the basket.','放进篮子。','The basket is light.','篮子很轻。'],
      ['receipt','/rɪˈsiːt/','发票','Give the receipt.','请给发票。','I got the receipt.','我拿到发票。']
    ],
    '居家生活': [
      ['home','/həʊm/','家','Go home.','回家。','Home is warm.','家很温暖。'],
      ['room','/ruːm/','房间','The room is big.','房间大。','Clean the room.','打扫房间。'],
      ['kitchen','/ˈkɪtʃɪn/','厨房','Cook in the kitchen.','在厨房做饭。','The kitchen is clean.','厨房干净。'],
      ['bed','/bed/','床','Sleep on the bed.','在床上睡。','The bed is comfy.','床很舒服。'],
      ['door','/dɔːr/','门','Close the door.','关门。','The door is open.','门开着。'],
      ['window','/ˈwɪndəʊ/','窗户','Open the window.','开窗。','The window is big.','窗户大。'],
      ['trash','/træʃ/','垃圾','Throw the trash.','扔垃圾。','Clear the trash.','收拾垃圾。'],
      ['broom','/bruːm/','扫帚','Sweep with a broom.','用扫帚扫。','I have a broom.','我有扫帚。'],
      ['TV','/ˌtiːˈviː/','电视','Watch TV.','看电视。','The TV is big.','电视大。'],
      ['fridge','/frɪdʒ/','冰箱','Open the fridge.','开冰箱。','The fridge is cold.','冰箱很凉。'],
      ['washer','/ˈwɒʃər/','洗衣机','Run the washer.','开洗衣机。','The washer broke.','洗衣机坏了。'],
      ['light','/laɪt/','灯','Turn on the light.','开灯。','The light is off.','灯关着。']
    ],
    '工作学习': [
      ['company','/ˈkʌmpəni/','公司','Go to the company.','去公司。','The company is far.','公司远。'],
      ['office','/ˈɒfɪs/','办公室','Work in the office.','在办公室工作。','The office is quiet.','办公室安静。'],
      ['work','/wɜːk/','工作','Do the work.','工作。','I have much work.','工作多。'],
      ['meeting','/ˈmiːtɪŋ/','会议','Have a meeting.','有会议。','We hold a meeting.','我们开会。'],
      ['computer','/kəmˈpjuːtər/','电脑','Use the computer.','用电脑。','The computer is slow.','电脑慢。'],
      ['book','/bʊk/','书','Read a book.','读书。','The book is thick.','书很厚。'],
      ['study','/ˈstʌdi/','学习','Study hard.','努力学习。','Study is important.','学习重要。'],
      ['exam','/ɪɡˈzæm/','考试','Have an exam.','有考试。','Take the exam.','参加考试。'],
      ['teacher','/ˈtiːtʃər/','老师','The teacher teaches.','老师教。','The teacher is kind.','老师亲切。'],
      ['friend','/frend/','朋友','Meet a friend.','见朋友。','I have many friends.','朋友多。'],
      ['note','/nəʊt/','笔记','Take a note.','记笔记。','I made a note.','我做笔记了。'],
      ['email','/ˈiːmeɪl/','邮件','Send an email.','发邮件。','The email arrived.','邮件来了。']
    ],
    '情绪感受': [
      ['happy','/ˈhæpi/','开心','I am happy.','我很开心。','I feel good.','我心情好。'],
      ['sad','/sæd/','悲伤','I am sad.','我很悲伤。','It is a sad movie.','是悲伤的电影。'],
      ['angry','/ˈæŋɡri/','生气','I am angry.','我生气。','I got angry.','我发火了。'],
      ['scared','/skeəd/','害怕','I am scared.','我害怕。','It is a scary movie.','是恐怖电影。'],
      ['tired','/ˈtaɪəd/','累','I am tired.','我累了。','I am so tired.','我太累了。'],
      ['hungry','/ˈhʌŋɡri/','饿','I am hungry.','我饿了。','I am starving.','我饿死了。'],
      ['thirsty','/ˈθɜːsti/','渴','I am thirsty.','我渴了。','I want water.','我想喝水。'],
      ['bored','/bɔːd/','无聊','I am bored.','我很无聊。','What to do when bored?','无聊时做什么？'],
      ['shy','/ʃaɪ/','害羞','I am shy.','我害羞。','It is embarrassing.','这很让人害羞。'],
      ['surprised','/səˈpraɪzd/','惊讶','I am surprised.','我很惊讶。','It is shocking news.','是惊人消息。'],
      ['grateful','/ˈɡreɪtfl/','感激','I am grateful.','我很感激。','Thanks for helping.','谢谢你的帮助。'],
      ['cheerful','/ˈtʃɪəfl/','愉快','I am cheerful.','我很愉快。','It is a cheerful day.','是愉快的一天。']
    ],
    '天气自然': [
      ['sky','/skaɪ/','天空','The sky is blue.','天空是蓝的。','The sky is clear.','天空晴朗。'],
      ['rain','/reɪn/','雨','It rains.','下雨。','It rains heavily.','下大雨。'],
      ['snow','/snəʊ/','雪','It snows.','下雪。','Snow is pretty.','雪很美。'],
      ['wind','/wɪnd/','风','The wind blows.','刮风。','The wind is strong.','风很大。'],
      ['sun','/sʌn/','太阳','The sun rises.','太阳升起。','The sun is warm.','太阳温暖。'],
      ['cloud','/klaʊd/','云','Clouds are many.','云很多。','Clouds are white.','云是白的。'],
      ['star','/stɑːr/','星星','Stars twinkle.','星星闪烁。','I watch stars.','我看星星。'],
      ['moon','/muːn/','月亮','The moon rises.','月亮升起。','The moon is round.','月亮圆。'],
      ['flower','/ˈflaʊər/','花','Flowers bloom.','花开。','Flowers are pretty.','花好看。'],
      ['tree','/triː/','树','The tree is big.','树很大。','Plant a tree.','种树。'],
      ['river','/ˈrɪvər/','河','The river flows.','河流淌。','The river is clear.','河水清。'],
      ['sea','/siː/','海','Go to the sea.','去海边。','The sea is vast.','海很宽广。']
    ],
    '数字时间': [
      ['one','/wʌn/','一','Give me one.','请给我一个。','One per day.','一天一个。'],
      ['two','/tuː/','二','I have two.','我有两个。','Two people eat.','两个人吃。'],
      ['three','/θriː/','三','Three gather.','三人聚。','Count to three.','数到三。'],
      ['ten','/ten/','十','I have ten.','我有十个。','It is ten now.','现在是十点。'],
      ['hundred','/ˈhʌndrəd/','百','It is one hundred.','是一百。','A hundred came.','来了一百人。'],
      ['thousand','/ˈθaʊznd/','千','It is one thousand.','是一千。','A thousand books.','一千本书。'],
      ['hour','/ˈaʊər/','点(时)','What time is it?','几点了？','It is three.','三点。'],
      ['minute','/ˈmɪnɪt/','分','Ten minutes.','十分钟。','Wait five minutes.','等五分钟。'],
      ['today','/təˈdeɪ/','今天','What today?','今天做什么？','Rest today.','今天休息。'],
      ['tomorrow','/təˈmɒrəʊ/','明天','See you tomorrow.','明天见。','Exam tomorrow.','明天考试。'],
      ['yesterday','/ˈjestədeɪ/','昨天','Went yesterday.','昨天去了。','It rained yesterday.','昨天下雨。'],
      ['weekend','/ˈwiːkend/','周末','Go on weekend.','周末去。','I like weekends.','我喜欢周末。']
    ]
  }
};
function buildVocab(tuples, field) {
  return tuples.map(t => {
    const ex = [];
    if (t[3]) ex.push({ [field]: t[3], zh: t[4] || '' });
    if (t[5]) ex.push({ [field]: t[5], zh: t[6] || '' });
    return { w: t[0], ph: t[1] || '', mean: t[2] || t[0], ex };
  });
}
function loadMyPack(lang, selId) {
  const theme = (document.getElementById(selId) || {}).value;
  const tuples = (VOCAB_PACKS[lang] && VOCAB_PACKS[lang][theme]) || [];
  const field = lang === 'ko-KR' ? 'ko' : lang === 'ja-JP' ? 'ja' : 'en';
  const arr = store.g(myStoreKey(lang), []);
  const have = new Set(arr.map(x => x.w));
  let added = 0, dup = 0;
  buildVocab(tuples, field).forEach(w => {
    if (have.has(w.w)) { dup++; return; }
    arr.push(w); have.add(w.w); added++;
  });
  store.s(myStoreKey(lang), arr); render();
  const msg = document.getElementById('mw_pack_msg'); if (msg) msg.textContent = `已加载 ${added} 个，跳过重复 ${dup} 个`;
}
const VEBB = [0, 1, 2, 4, 7, 15, 30];
function vbState(key) { return store.g(key, {}); }
function vbLearned(key) { return store.g(key, []); }
function vbLearnToday(src, learnedKey) {
  const L = vbLearned(learnedKey);
  let pick = src.filter(w => !L.includes(w.w));
  if (pick.length < 10) pick = pick.concat(src.filter(w => L.includes(w.w)));
  return pick.slice(0, 10);
}
function vbReviewDue(src, stateKey) {
  const rec = vbState(stateKey), t = today();
  return src.filter(w => rec[w.w] && rec[w.w].level < 6 && rec[w.w].next <= t);
}
function vbFinishToday(srcName, stateKey, learnedKey, ckKey) {
  const L = vbLearned(learnedKey), rec = vbState(stateKey), src = getSrc(srcName);
  vbLearnToday(src, learnedKey).forEach(w => {
    if (!L.includes(w.w)) L.push(w.w);
    if (!rec[w.w]) rec[w.w] = { first: today(), level: 0, next: today(), last: today() };
  });
  store.s(learnedKey, L); store.s(stateKey, rec); ckArr(ckKey); render();
}
function vbReviewDone(srcName, stateKey, ckKey, w) {
  const rec = vbState(stateKey); const o = rec[w]; if (!o) return;
  o.level = Math.min(6, o.level + 1);
  const add = VEBB[Math.min(o.level, VEBB.length - 1)];
  const d = new Date(); d.setDate(d.getDate() + add);
  o.next = fmt(d); o.last = today();
  store.s(stateKey, rec); ckArr(ckKey); render();
}
function vbSpeak(srcName, i, lang) { const src = getSrc(srcName); const w = src[i]; if (w) speak(w.w, lang); }
function vbSpeakEx(srcName, i, ei, lang, exField) { const src = getSrc(srcName); const w = src[i]; if (w && w.ex[ei]) speak(w.ex[ei][exField], lang); }
function vbBody(src, srcName, cfg) {
  const stateKey = cfg.stateKey, learnedKey = cfg.learnedKey, wrongKey = cfg.wrongKey, ckKey = cfg.ckKey, lang = cfg.lang, exField = cfg.exField;
  const L = vbLearned(learnedKey), rec = vbState(stateKey);
  const todayNew = vbLearnToday(src, learnedKey);
  const due = vbReviewDue(src, stateKey);
  const ck = store.g(ckKey, []);
  const lvCount = [0, 1, 2, 3, 4, 5, 6].map(l => src.filter(w => rec[w.w] && rec[w.w].level === l).length);
  const wrong = wrongSetK(wrongKey);
  const newCard = (w) => {
    const gi = src.indexOf(w);
    return `<div class="card" style="padding:12px">
      <div class="row" style="justify-content:space-between;align-items:center">
        <div><b style="font-size:16px">${esc(w.w)}</b> <span class="li-sub">${esc(w.ph)}</span></div>
        <div class="row" style="gap:6px">
          <button class="btn sm" onclick="vbSpeak('${srcName}',${gi},'${lang}')">🔊</button>
          <span id="vb_${srcName}_${gi}"></span>
          <button class="btn sm ghost" onclick="recToggle('vb_${srcName}_${gi}','${lang}','${esc(w.w)}','${wrongKey}')">🎙</button>
          <button class="btn sm ghost" onclick="toggleWrongK('${esc(w.w)}','${wrongKey}')" title="加入错词本">🔴</button>
        </div>
      </div>
      <div class="li-sub" style="margin-top:4px">${esc(w.mean)}</div>
      ${w.ex.map((x, ei) => `<div class="list-item" style="border:none;padding:6px 0">
        <div class="li-main" style="display:flex;gap:6px;align-items:flex-start"><span style="flex:1">${esc(x[exField])}<div class="li-sub">${esc(x.zh)}</div></span>
        <button class="btn sm" onclick="vbSpeakEx('${srcName}',${gi},${ei},'${lang}','${exField}')">🔊</button></div>
        <div class="row mt" style="justify-content:flex-start"><span id="vbx_${srcName}_${gi}_${ei}"></span><button class="btn sm ghost" onclick="recToggle('vbx_${srcName}_${gi}_${ei}','${lang}')">🎙 跟读</button></div>
      </div>`).join('')}
    </div>`;
  };
  return `
  <div class="card"><h3>📚 今日新词（${todayNew.length} 个）</h3>
    <div class="li-sub" style="margin-bottom:8px">学完点下方按钮，自动加入艾宾浩斯复习计划（主题：数字/食物/家庭/时间/颜色/动词/身体/动物）</div>
    ${todayNew.map(w => newCard(w)).join('')}
    <button class="btn mt" onclick="vbFinishToday('${srcName}','${stateKey}','${learnedKey}','${ckKey}')">✅ 我已学完今日新词</button>
  </div>
  <div class="card"><h3>🔁 待复习（${due.length} 个）</h3>
    ${due.length ? due.map(w => { const gi = src.indexOf(w); return `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(w.w)}</b><span class="li-sub">${esc(w.ph)} · ${esc(w.mean)}</span>
      <button class="btn sm" onclick="vbSpeak('${srcName}',${gi},'${lang}')">🔊</button><span id="vbr_${srcName}_${gi}"></span><button class="btn sm ghost" onclick="recToggle('vbr_${srcName}_${gi}','${lang}','${esc(w.w)}','${wrongKey}')">🎙</button>
      <button class="btn sm ghost" onclick="toggleWrongK('${esc(w.w)}','${wrongKey}')" title="加入错词本">🔴</button>
      <button class="btn sm pink" onclick="vbReviewDone('${srcName}','${stateKey}','${ckKey}','${esc(w.w)}')">记住了 🔁</button></div></div>`; }).join('') : '<div class="empty">今日没有待复习的词，太棒了 🎉</div>'}
  </div>
  <div class="card"><h3>🔴 错词本 / 生词本（${wrong.length}）</h3>
    <div class="li-sub" style="margin-bottom:8px">跟读识别不符、或点 🔴 加入的词会在这里，重点复习。</div>
    ${wrong.length ? wrong.map(w => { const gi = src.findIndex(x => x.w === w); const wd = src[gi]; return `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(w)}</b>${wd ? ` <span class="li-sub">${esc(wd.ph)} · ${esc(wd.mean)}</span>` : ''}
      <button class="btn sm" onclick="speak('${esc(w)}','${lang}')">🔊</button><span id="vbw_${srcName}_${gi}"></span><button class="btn sm ghost" onclick="recToggle('vbw_${srcName}_${gi}','${lang}','${esc(w)}','${wrongKey}')">🎙</button>
      <button class="btn sm pink" onclick="toggleWrongK('${esc(w)}','${wrongKey}')">已掌握 🔴</button></div></div>`; }).join('') + `<button class="btn mt ghost" onclick="clearWrongK('${wrongKey}')">全部标记为已掌握</button>` : '<div class="empty">还没有错词，继续保持 💪</div>'}
  </div>
  <div class="card"><h3>📈 学习进度（历史）</h3>
    <div class="stat-grid">
      <div class="stat"><div class="num">${L.length}</div><div class="lb">已学词数</div></div>
      <div class="stat"><div class="num pk">${streakOf(ck)}</div><div class="lb">连续学习(天)</div></div>
      <div class="stat"><div class="num">${ck.length}</div><div class="lb">累计学习(天)</div></div>
    </div>
    <div class="li-sub" style="margin-top:6px">熟练度分布（L0 生疏 → L6 掌握）：${lvCount.join(' / ')}</div>
    <div class="li-sub">艾宾浩斯间隔：当天 → 1 → 2 → 4 → 7 → 15 → 30 天逐级复习</div>
  </div>`;
}
/* ============ 我的词库（自定义导入：手动添加 + 批量粘贴导入） ============ */
function myStoreKey(lang) { return lang === 'ko-KR' ? 'myKrVocab' : lang === 'ja-JP' ? 'myJpVocab' : 'myEnVocab'; }
function myExField(lang) { return lang === 'en-US' ? 'en' : lang === 'ko-KR' ? 'ko' : 'ja'; }
function addMyWord(lang) {
  const w = $('#mw_w').value.trim(), mean = $('#mw_mean').value.trim();
  if (!w) { alert('请填写单词'); return; }
  const ef = myExField(lang), ex = [];
  const e1 = $('#mw_e1').value.trim(), e1z = $('#mw_e1z').value.trim();
  if (e1) ex.push({ [ef]: e1, zh: e1z });
  const e2 = $('#mw_e2').value.trim(), e2z = $('#mw_e2z').value.trim();
  if (e2) ex.push({ [ef]: e2, zh: e2z });
  const arr = store.g(myStoreKey(lang), []);
  if (arr.some(x => x.w === w)) { alert('该词已存在'); return; }
  arr.push({ w, ph: $('#mw_ph').value.trim(), mean: mean || w, ex });
  store.s(myStoreKey(lang), arr); render();
}
function importMyWords(lang) {
  const text = $('#mw_imp').value.trim();
  if (!text) { alert('请先粘贴要导入的词'); return; }
  const arr = store.g(myStoreKey(lang), []), have = new Set(arr.map(x => x.w));
  const ef = myExField(lang); let added = 0, dup = 0;
  text.split(/\n+/).forEach(line => {
    line = line.trim(); if (!line) return;
    let w, ph = '', mean = '', ex = [];
    if (/[,，\t]/.test(line)) { // CSV
      const f = line.split(/[,，\t]/).map(s => s.trim());
      w = f[0]; ph = f[1] || ''; mean = f[2] || '';
      for (let i = 3; i + 1 < f.length; i += 2) { if (f[i]) ex.push({ [ef]: f[i], zh: f[i + 1] || '' }); }
    } else { // 纯文本：| 或 ／ 或 / 分隔，否则按空格
      const parts = line.split(/[|／/]/);
      if (parts.length >= 2) { w = parts[0]; mean = parts.slice(1).join('|'); }
      else { const sp = line.split(/\s+/); w = sp[0]; mean = sp.slice(1).join(' '); }
    }
    if (!w) return;
    if (have.has(w) || arr.some(x => x.w === w)) { dup++; return; }
    arr.push({ w, ph, mean: mean || w, ex }); have.add(w); added++;
  });
  store.s(myStoreKey(lang), arr); render();
  const msg = document.getElementById('mw_imp_msg'); if (msg) msg.textContent = `已导入 ${added} 个，跳过重复 ${dup} 个`;
}
function delMyWord(lang, i) {
  const arr = store.g(myStoreKey(lang), []);
  if (i >= 0 && i < arr.length) { arr.splice(i, 1); store.s(myStoreKey(lang), arr); render(); }
}
function myVocabManage(lang, exField, srcName, cfg) {
  const storeKey = myStoreKey(lang);
  const list = store.g(storeKey, []);
  const src = getSrc(srcName);
  const packThemes = (VOCAB_PACKS[lang] && Object.keys(VOCAB_PACKS[lang])) || [];
  const packSection = packThemes.length ? `<div class="card"><h3>📦 主题词包（一键加入 · ${packThemes.length} 类）</h3>
    <div class="li-sub" style="margin-bottom:6px">选一个主题，点「加载」即可把该主题词包加入你的词库，并自动进入艾宾浩斯复习。不同主题互不重复，可多次加载不同主题来扩充词汇量。</div>
    <div class="row"><select id="mw_pack_sel">${packThemes.map(t => `<option>${esc(t)}</option>`).join('')}</select>
    <button class="btn" onclick="loadMyPack('${lang}','mw_pack_sel')">加载到我的词库 ➕</button><span id="mw_pack_msg" class="li-sub"></span></div>
  </div>` : '';
  const phHint = lang === 'en-US' ? 'apple' : lang === 'ko-KR' ? '사과' : 'りんご';
  const learn = list.length ? `<div class="card"><h3>📚 我的词库学习区（${list.length} 词）</h3>${vbBody(src, srcName, cfg)}</div>`
                            : '<div class="empty" style="padding:14px">词库还是空的，先在上方添加或导入单词吧～</div>';
  return `
  <div class="card"><h3>➕ 手动添加单词</h3>
    <div class="row"><input id="mw_w" placeholder="单词，如 ${phHint}"><input id="mw_ph" placeholder="音标(选填)"><input class="grow" id="mw_mean" placeholder="释义，如：苹果"></div>
    <div class="row mt"><input class="grow" id="mw_e1" placeholder="例句1(外文，选填)"><input class="grow" id="mw_e1z" placeholder="例句1中文(选填)"></div>
    <div class="row mt"><input class="grow" id="mw_e2" placeholder="例句2(外文，选填)"><input class="grow" id="mw_e2z" placeholder="例句2中文(选填)"></div>
    <div class="row mt"><button class="btn" onclick="addMyWord('${lang}')">添加 ➕</button><span class="li-sub">已添加 ${list.length} 词</span></div>
  </div>
  <div class="card"><h3>📥 批量导入</h3>
    <div class="li-sub" style="margin-bottom:6px">每行一条，支持两种格式：<br>
    • <b>CSV</b>：单词,音标,释义,例句1,例句1译,例句2,例句2译（字段可少，逗号可用中文逗号/制表符）<br>
    • <b>纯文本</b>：单词|释义 或 单词/释义（用 | 或 / 或 Tab 分隔，例句留空）</div>
    <textarea id="mw_imp" rows="5" placeholder="apple,/ˈæpəl/,苹果,This is an apple.,这是苹果.\nsa과,/sa-gwa/,苹果,사과가 맛있어요.,苹果好吃.\nりんご,/ringo/,苹果,りんごが好きです.,喜欢苹果."></textarea>
    <div class="row mt"><button class="btn" onclick="importMyWords('${lang}')">导入到本语言词库 ➕</button><span id="mw_imp_msg" class="li-sub"></span></div>
  </div>
  ${packSection}
  ${list.length ? `<div class="card"><h3>🗂 我的词列表（${list.length}）</h3>${list.map((w, i) => `<div class="list-item"><div class="li-main"><b>${esc(w.w)}</b> <span class="li-sub">${esc(w.ph || '')} · ${esc(w.mean)}</span></div><button class="btn sm warn" onclick="delMyWord('${lang}',${i})">删</button></div>`).join('')}</div>` : ''}
  ${learn}
  `;
}
