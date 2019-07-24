# tictacx

A fun strategic take on tictactoe
With 9 boards there's 8 ways to win

## Rules

each cell in board corresponds to a different board.

i.e selecting the 2nd cell in board 1 will send opponent to board 2.

opponents cannot send each other to previous board unless current board has no other option.

must win 3 boards in a row.

![](./src/assets/images/tictacx-screen-capture_1.gif)

## Nativescript - faster launch

tns run android --bundle --env.uglify
tns run ios --bundle --env.uglify

## To Run Server

npm run dev-serve http://localhost:9000

npm run dev-prod