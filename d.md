src
┣ assets
┣ config # 새롭게 추가됨. 전역 설정 파일 (e.g. env, api, react-query, ...)
┣ entities
┣ features # 새롭게 추가됨. feature-specific file 모음
┃ ┣ club
┃ ┃ ┗ screens
┃ ┃ ┃ ┣ ClubDetailScreen
┃ ┃ ┃ ┣ ClubListScreen
┃ ┃ ┃ ┣ ClubRankingScreen
┃ ┃ ┃ ┣ ClubReviewScreen
┃ ┃ ┃ ┗ SearchResultClubListScreen
┃ ┣ home
┃ ┃ ┗ screens
┃ ┃ ┃ ┗ HomeScreen
┃ ┣ mypage
┃ ┃ ┗ screens
┃ ┃ ┃ ┣ EditProfileScreen
┃ ┃ ┃ ┣ ManageClubListScreen
┃ ┃ ┃ ┣ MyPageScreen
┃ ┃ ┃ ┗ SavedClubListScreen
┃ ┗ webview
┃ ┃ ┗ screens
┃ ┃ ┃ ┗ WebviewScreen
┣ repositories
┣ shared # 새롭게 추가됨. feature-shared file 모음
┃ ┣ components
┃ ┣ constants
┃ ┣ contexts
┃ ┣ hocs
┃ ┣ hooks
┃ ┗ utils
┣ tabs
┗ usecases
