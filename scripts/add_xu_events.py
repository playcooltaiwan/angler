import json

with open('public/events.json', encoding='utf-8') as f:
    events = json.load(f)

new_events = [
  {
    "id": "xu_forum_meet",
    "date": "105-01-01",
    "date_display": "105至106年間",
    "title": "海峽論壇：徐春鶯結識楊文濤",
    "type": "境外聯繫",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "鍾錦明", "楊文濤"],
    "summary": "徐春鶯、鍾錦明以陸配婚姻家庭服務名義，赴大陸參加由廈門民政局婚姻中心承辦的「海峽兩岸婚姻家庭論壇」，結識楊文濤。此後兩人稱楊文濤為「濤哥」，開始長期彙報台灣陸配群體的參政情況、日常言論與活動。",
    "significance": "這是整個滲透關係的起點。楊文濤是境外敵對勢力派遣之人，此次接觸讓中共有了深入台灣陸配社群的固定管道。",
    "source_segments": [3, 31, 4, 45],
    "connected_events": ["xu_alliance"],
    "dialogue": []
  },
  {
    "id": "xu_alliance",
    "date": "108-01-01",
    "date_display": "108年",
    "title": "婚姻家庭服務聯盟：整合40個陸配團體",
    "type": "境外聯繫",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "鍾錦明", "楊文濤"],
    "summary": "徐春鶯、鍾錦明整合全國40個陸配團體，成立中華兩岸婚姻家庭服務聯盟，突顯陸配群體的政治影響力。聯盟成立進度持續向楊文濤彙報，讓楊文濤掌握台灣陸配組織整體狀況。",
    "significance": "這個聯盟成為日後干預選舉的組織基礎。中共透過楊文濤掌握了台灣40個陸配團體的動態，是境外勢力介入台灣政治的具體載體。",
    "source_segments": [4, 23, 122, 55],
    "connected_events": ["xu_forum_meet", "xu_huang_mother"],
    "dialogue": []
  },
  {
    "id": "xu_huang_mother",
    "date": "110-05-01",
    "date_display": "110年5月",
    "title": "「問我什麼色我是紅色的」：向楊文濤請示支持黃珊珊",
    "type": "選舉介入",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "楊文濤", "黃珊珊"],
    "summary": "110年5月1日黃珊珊出席聯盟母親節活動後，徐春鶯於5月3日傳合照給楊文濤，報告黃珊珊將競選臺北市長。楊文濤回應「她支持咱，咱就支持她！」徐春鶯確認獲得應允，回覆「我公開說過，我不是藍的更不會是綠的，問我什麼色我是紅色的」，楊文濤表示「咱們中心堅定支持○鶯姐！」",
    "significance": "「問我什麼色我是紅色的」是本案最關鍵的自白。徐春鶯向中共境外勢力請示支持對象、確認立場符合中共政策，是違反反滲透法的核心證據。",
    "source_segments": [132, 5, 51, 52],
    "connected_events": ["xu_alliance", "xu_huang_rally"],
    "dialogue": [
      {
        "speaker": "徐春鶯",
        "channel": "LINE",
        "content": "（傳送與黃珊珊合照）黃珊珊將參選臺北市市長選舉，於參與活動時表達爭取陸配群體支持意願。",
        "source_segment": 5
      },
      {
        "speaker": "楊文濤",
        "channel": "LINE",
        "content": "她支持咱，咱就支持她！誰對我好就支持誰（當然，政治上不能搞台獨，否則大陸這邊也行不通啦。）",
        "source_segment": 5
      },
      {
        "speaker": "徐春鶯",
        "channel": "LINE",
        "content": "濤哥，我明白的。政治上我公開支持兩岸和平統一。",
        "source_segment": 5
      },
      {
        "speaker": "楊文濤",
        "channel": "LINE",
        "content": "那我就更沒啥擔心的啦！咱們中心堅定支持○鶯姐！",
        "source_segment": 5
      },
      {
        "speaker": "徐春鶯",
        "channel": "LINE",
        "content": "謝謝濤濤！我也堅決支持中心的各項工作。我公開說過，我不是藍的更不會是綠的，問我什麼色我是紅色的。",
        "source_segment": 5
      },
      {
        "speaker": "楊文濤",
        "channel": "LINE",
        "content": "我在這邊也不爭風頭，但是我知道，咱們中心說話是有份量的。在台陸配這方面，還是中心的評價比誰的都可靠。",
        "source_segment": 5
      }
    ]
  },
  {
    "id": "xu_huang_rally",
    "date": "111-09-25",
    "date_display": "111年9月25日",
    "title": "黃珊珊競選總部成立大會：上台領後援會會長獎盃",
    "type": "選舉介入",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "鍾錦明", "黃珊珊"],
    "summary": "徐春鶯、鍾錦明在臺北市立大學博愛校區中正堂黃珊珊競選總部成立大會，一同上台領取後援會會長獎盃，公開站台造勢。會後轉赴長安西路馬來亞餐廳，邀請黃珊珊出席新住民領導人就職典禮，黃珊珊係唯一受邀出席的市長候選人。",
    "significance": "徐春鶯知悉動員陸配係受楊文濤指示、符合中共政策立場，仍公開上台站台。這是「受境外勢力指示、為候選人宣傳造勢」的直接行為證據。",
    "source_segments": [6, 27, 22, 127],
    "connected_events": ["xu_huang_mother", "xu_beijing_visit"],
    "dialogue": []
  },
  {
    "id": "xu_beijing_visit",
    "date": "112-09-11",
    "date_display": "112年9月11至17日",
    "title": "北京參訪：接觸中共五大統戰組織",
    "type": "境外聯繫",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "鍾錦明", "楊文濤"],
    "summary": "徐春鶯、鍾錦明帶同婚姻家庭服務聯盟成員赴北京，進行廈門民政局婚姻中心安排的參訪，依序拜會：中共全國婦女聯合會、中共國台辦、中共台灣民主自治同盟中央委員會、中共全國台灣同胞聯誼會、中共民政部，共五大統戰機構。",
    "significance": "楊文濤在之後的對話中說「這次參訪明顯就是給聯盟一個優勢視角，其他的參訪絕對做不到我這個水平」，將此次行程作為說服民眾黨提供不分區立委安全名單的籌碼。",
    "source_segments": [8, 3, 58, 63],
    "connected_events": ["xu_huang_rally", "xu_die_content"],
    "dialogue": []
  },
  {
    "id": "xu_die_content",
    "date": "112-09-19",
    "date_display": "112年9月19日",
    "title": "「死都瞑目」：鍾錦明與楊文濤談陸配三席",
    "type": "境外聯繫",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["鍾錦明", "楊文濤"],
    "summary": "北京參訪結束兩天後，鍾錦明與楊文濤討論民眾黨不分區立委安全名單。鍾錦明說「我想的是三席，國民黨一席民眾黨一席」，計劃「搞一個陸配大聯盟，那推法案就簡單了」，並說「怎麼統一我也說不上，可是讓這些姐妹能夠上的位置上了……」楊文濤回應「那我死都瞑目了，我這幾年都沒白幹啊……」",
    "significance": "這段通話明確揭示滲透目的：讓陸配進入立法院，形成推動統一的政治力量。楊文濤說「咱說多也就不安全了是吧」，顯示其清楚意識到行為的政治敏感性。",
    "source_segments": [8, 22, 51, 52],
    "connected_events": ["xu_beijing_visit", "xu_tpp_scandal"],
    "dialogue": [
      {
        "speaker": "鍾錦明",
        "channel": "書面文件",
        "content": "總之，我們就把話拉到這邊啦。如果有，我全力以赴，包括出人、出錢、出力都沒有問題。",
        "source_segment": 8
      },
      {
        "speaker": "楊文濤",
        "channel": "書面文件",
        "content": "他答應給咱們安全名單嗎？如果可以，我覺得這是一個好事，首先是有了一席之地，再一個還可以刺激一下國民黨。我覺得其他也不好多說啦，咱說多也就不安全了是吧，反正我就支持你們，你們放心吧。",
        "source_segment": 8
      },
      {
        "speaker": "鍾錦明",
        "channel": "書面文件",
        "content": "我想的是三席，國民黨一席民眾黨一席，如果新黨真的給他在不分區安全名單內，那咱們三席的話，那就不一樣了，講話就大聲啦。然後搞一個陸配大聯盟，那推法案就簡單了。總之，怎麼統一我也說不上，可是讓這些姐妹能夠上的位置上了……",
        "source_segment": 8
      },
      {
        "speaker": "楊文濤",
        "channel": "書面文件",
        "content": "那就太好了呀，那我死都瞑目了，我這幾年都沒白幹啊……",
        "source_segment": 8
      }
    ]
  },
  {
    "id": "xu_tpp_scandal",
    "date": "112-10-27",
    "date_display": "112年10月至11月",
    "title": "提名風波：媒體爆促統言論、婉謝後仍助選",
    "type": "選舉介入",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "鍾錦明", "楊文濤", "孫憲"],
    "summary": "112年10月27日民眾黨不分區名單公布，媒體報導徐春鶯促統言論引發爭議。楊文濤、孫憲在中國大陸代徐春鶯辦理戶籍註銷證明，以利其擔任立委。112年11月14日徐春鶯婉謝提名，但仍陸續出席11月16日民眾黨多元族群記者會、113年1月8日KPTV採訪，並持續向楊文濤彙報參與情形。",
    "significance": "即使在爭議爆發、婉謝提名之後，徐春鶯仍「承前犯意」繼續助選。楊文濤在中國大陸協助處理戶籍文件，說明境外勢力對徐春鶯的介入深度超越選舉本身。",
    "source_segments": [9, 163, 149, 7],
    "connected_events": ["xu_die_content", "xu_election_eve"],
    "dialogue": []
  },
  {
    "id": "xu_election_eve",
    "date": "113-01-12",
    "date_display": "113年1月12日",
    "title": "民眾黨選前之夜：公開站台支持柯文哲",
    "type": "選舉介入",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "柯文哲"],
    "summary": "113年1月12日，徐春鶯出席民眾黨選前之夜，公開上台宣傳支持總統候選人柯文哲。這是徐春鶯婉謝提名後，受楊文濤及孫憲指示繼續助選的最後一個具體公開行動。選後徐春鶯、鍾錦明繼續參與民眾黨黨務，孫憲亦持續對徐春鶯從事政治活動給予指示。",
    "significance": "選前之夜是競選活動最高點，公開站台是違反反滲透法「為候選人宣傳造勢」的直接事實。從結識楊文濤到最後站台，歷時約8年的滲透脈絡在此完整呈現。",
    "source_segments": [9, 29, 51, 7],
    "connected_events": ["xu_tpp_scandal", "xu_sun_entry"],
    "dialogue": []
  },
  {
    "id": "xu_sun_entry",
    "date": "113-12-29",
    "date_display": "113年12月至114年10月",
    "title": "安排孫憲持偽造文件入境台灣",
    "type": "違法入境",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯", "孫憲"],
    "summary": "徐春鶯明知孫憲真實身分為民革上海市委員會副主任，不得以商務名義入境，仍透過友人羅某的公司以邀請商務交流名義提出申請，在申請書上虛偽填載孫憲「未曾任中國大陸地區黨務、行政、軍事組織職務」。114年3月3日製作偽造行程表與保證書。孫憲於114年10月14至24日假藉商務交流入境台灣。",
    "significance": "孫憲是長期指揮徐春鶯政治活動的中共統戰人員。此次入境讓境外勢力得以在台灣境內直接接觸陸配社群，滲透路徑從遠端轉為實體接觸。",
    "source_segments": [103, 16, 176, 27],
    "connected_events": ["xu_election_eve"],
    "dialogue": []
  },
  {
    "id": "xu_underground_fx",
    "date": "109-01-01",
    "date_display": "109年至114年",
    "title": "地下匯兌2875萬：台幣、人民幣、美金三向操作",
    "type": "金流",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯"],
    "summary": "109年至114年間，徐春鶯提供個人帳戶非法辦理台幣、人民幣、美金三向匯兌。客戶交付台幣後，徐春鶯透過其在中國大陸的銀行帳戶或微信支付，將等值人民幣匯至客戶指定帳戶。換匯金額累計達新臺幣2,875萬餘元，犯罪所得24萬餘元。",
    "significance": "地下匯兌揭示徐春鶯在中國大陸設有多個銀行帳戶及微信支付的跨境金融基礎，呼應其長期兩岸往來的生活模式。",
    "source_segments": [84, 114, 14, 109],
    "connected_events": ["xu_fraud_loan"],
    "dialogue": []
  },
  {
    "id": "xu_fraud_loan",
    "date": "109-08-07",
    "date_display": "109年8月至112年2月",
    "title": "偽造在職證明詐貸2697萬",
    "type": "詐欺",
    "case": "徐春鶯案",
    "source_doc": "xu_chunying_indictment",
    "persons": ["徐春鶯"],
    "summary": "徐春鶯以女兒卜某正名義申辦房屋貸款，由友人羅某的公司為卜某正虛偽投保勞保、製作在職證明，並偽造徐春鶯與該公司的顧問服務合約書（虛載4年共支付144萬元顧問費）。徐春鶯更指示在合約起始日期上「幫我改109年6月」。持偽造文件向合庫蘆洲分行申辦，使行員誤信家庭年收入達190萬元，核貸2,697萬元。115年3月法院以扣押裁定查扣房地。",
    "significance": "偽造的顧問合約刻意依銀行要求調整起始日期，顯示主觀犯意明確。詐貸2697萬是本案金額最大的單一罪行，起訴書有徐春鶯傳LINE「幫我改109年6月」的完整紀錄。",
    "source_segments": [14, 15, 90, 100],
    "connected_events": ["xu_underground_fx"],
    "dialogue": []
  }
]

events.extend(new_events)
events.sort(key=lambda e: e['date'])

with open('public/events.json', 'w', encoding='utf-8') as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f'新增 {len(new_events)} 個事件，共 {len(events)} 個')
for e in new_events:
    print(f'  {e["date"]}  [{e["type"]}]  {e["title"]}')
