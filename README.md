# cheerMeUp -- Speaks motivational quotes with ElevenLabs TTS

このアプリケーション (https://mmurak.github.io/cheerMeUp/index.html) は、過去・現在の偉人や賢人の名言（英語）をElevenLabsの音声合成機能を用いて再生することで、リスニング能力の強化と、日々の勉強／仕事におけるモチベーションの向上を図ろうというものです。

![Fig](https://github.com/mmurak/cheerMeUp/assets/7446897/d1fe80a5-bb2f-4a35-a130-ef2868926d05)

## 必要なもの

- ブラウザー（Google Chromeでテストしています）
- インターネット接続
- ElevenLabsのAPI Key（取得方法は後述）

## 基本的な使い方

1. ［Give me a piece of wisdom］ボタンを押すと設定された「声」（Voice）で音声が聞けます。
1. リスニングした結果を白いテキスト枠内に打ち込みます（任意）。
1. 一度で聞き取れなかった場合は［Replay］ボタンを押すと再度音声が聞けます。
1. ［Display text］ボタンを押すと、正解（？）が表示されます。
1. ［Utter this］ボタンを押すと白いテキスト枠の内容が、設定された「声」で再生されるため、聴き比べることができます。

## 使用に先立つ準備と注意事項

- ElevenLabsのAPI Keyを［API Key］欄に入力し、右隣の［Set up］ボタンを押します。

この操作により［Voice］選択が可能になります。

※ 注意事項：
［Set up］ボタンを押すと、使用準備が整えられるとともに、PC／スマホ／タブレット（以下「端末」と表記）内の保存領域に API Key が保存されます。
これにより、使用時に毎回API Key（とVoice）を設定する必要はなくなりますが、他の人が端末を使用する可能性がある場合には、使用終了時に毎回［Forget API-Key］ボタンを押し、端末の保存領域をクリアするようにしてください。

## ElevenLabsのAPI Keyを取得するには

既にElevenLabsのユーザー登録を済ませている場合には、4に進んでください。

1. [https://elevenlabs.io/](https://elevenlabs.io/) にアクセスし、右上のボタンをクリックする。

![FigA](https://github.com/mmurak/cheerMeUp/assets/7446897/0ced3fe7-7642-45c1-94c5-306131bc48c9)

2. 以下の画面が表示されるため、Sign upをクリックする。

![FigB](https://github.com/mmurak/cheerMeUp/assets/7446897/6872607e-bd94-4abf-9f37-ebb5293569f1)

3. 以下の画面が表示されるため、Googleのアカウントでサインアップするか、自前のメールアドレスでサインアップするかに応じて必要事項を記述する（この手順の終了後、確認メールが届きます）。

![FigC](https://github.com/mmurak/cheerMeUp/assets/7446897/5a8634b2-a234-4a03-a5e6-6464f8ac50be)

4. サインインすると以下の画面が表示されるため、ユーザーアイコン（ここでは家紋が表示されています）をクリックする。

![FigD](https://github.com/mmurak/cheerMeUp/assets/7446897/77eebfe9-d3ec-4e6c-adc2-00f02e1a630c)

5. すると画面が以下のようになるため、［Profile］をクリックする。

![FigE](https://github.com/mmurak/cheerMeUp/assets/7446897/3eeffaf5-463c-4aa7-86fa-812649b80a24)

6. 以下のようなProfile Setting画面が表示されるため、「目」のアイコンをクリックすると、API Key欄の「**********」が文字群に変化するため、その文字群をコピーする。

![FigF](https://github.com/mmurak/cheerMeUp/assets/7446897/8bbe4613-920e-4603-8da8-7fdfa835846f)
