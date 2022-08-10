# i18n 자동화

목적:
i18n을 사용할 때, 매번 번역된 값을 번역가와 주고 받기 불편합니다.
그래서 구글 엑셀시트를 이용해 하나의 파일로 관리하여 쉽게 번역값 다운받도록 하였습니다.

# 주요 사용하는 라이브러리, 프레임워크

next.js
next-i18next
google-spreadsheet
i18next-scanner

# desc

1. i18next-scanner를 이용해, key값을 추출합니다.
2. google-spreadsheet를 통해, key값을 업로드합니다.
3. google-spreadsheet를 통해, 입력된 엑셀시트 값을 다운로드합니다.

# 확장성

번역이 필요한 값이 많을 수록, 하나의 엑셀 시트에 번역 값을 넣기에는 불편합니다.
그래서 namespace별, 엑셀 시트를 만들어 나눠 관리 할 수 있도록 구현하였습니다.
