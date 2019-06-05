# FinTrack by Team NigerianPrince

## Overview
Proposed level of achievement: Apollo 11

This is a stock portfolio tracker that helps users to conveniently track their financial assets and dividend yield, personalised to include various miscellaneous fees independent of stock value.
Users will be able to create accounts and fill in their respective data.

The app will display graphs to visualise user portfolios and track dividends.

## Motivation
Keeping track of your stock portfolio can be a daunting and tiresome inconvenience. This inconvenience only worsens as your portfolio increases in size across multiple brokerage services! Hence, this app aims to be a centralized stop for you to collate your portfolio data in a single location.

Dividend tracking is a rare feature amongst today's stock portfolio apps in the market despite being useful data to track, thus we hope to add this feature to value-add.

Brokerage and miscellaneous fees are also an essential feature for a stock portfolio app which we will include for you to easily track your portfolio.

Information in financial apps are often rather cryptic and confusing, hence we hope to implement data visualisation for you for simplicity and accessibility.

News platform integrated into this app will allow you to quickly catch up on the latest updates regarding the companies that you are invested in, saving you time from scouring the web manually from news outlets and blogs for the same updates.

## Aim
We aim to develop a mobile application that improves user experience for people interested in tracking their stock portfolio through a mobile application but has no time to do so manually. Through UI/UX simplicity and overall convenience, we aim to provide a tracker for users’ stock portfolio, which may be composed of data that is spread over multiple investments, with possibly different brokerage fees. Ultimately, this app hopes to be a casual yet powerful tool for you to utilise to supplement your trading experience.

## User Stories
- As a user, I want relevant stock data to be presented in a concise way, so I can check on my portfolio quickly and conveniently.
- As a user, I want my dividend yield to be tracked together with my stock portfolio for convenience.
- As a user, I want to check my progress without distractions from clutter such as that of traditional stocktracking apps, so that I can focus on what is important.

## Scope of project
The mobile application provides a platform for users to create an account and store their user specific data.
The application will allow users to navigate to several pages, which are mainly, home page, transaction summary page, portfolio summary page, account summary page, news page, settings page.
These pages serve their respective purposes as covered earlier.


## Features
- Dividend tracking
- Data visualisation
- Inclusion of brokerage and other miscellaneous fees
- Simple UI to minimise information overload

## RoadMap
- June - Core features
  - UI
  - User accounts
  - Divident tracking
  - Brokerage and miscellaneous fees
- July - Extension features
  - Data visualisation
  - News platform

## System Design
- Database
  - maintains financial data through regular API calls
  - stores users' account data
- UI
  - home page functionality
    - add/remove stock
    - view overall portfolio
    - go to list of transactions
  - list of transactions
    - transaction history which includes buying, selling of stocks, and dividend receipts

## Built with
- [React Native](https://facebook.github.io/react-native/)
  - [NativeBase](https://nativebase.io)
  - [Vector Icons](https://github.com/oblador/react-native-vector-icons)
  - [React Navigation](https://reactnavigation.org)
- [MongoDB](https://www.mongodb.com)
- [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Potential Extension Features
- Compilation of news relevant to users' portfolio
- IOS port
- (might be too much of a stretch) stock recommendation algorithm

## Authors
- Keith Teo [@envere](https://github.com/envere)
- Marc Fong [@marcfyk](https://github.com/marcfyk)

***

### NigerianPrince Fluff
> Donate your money to our Patreon to help me claim back the throne !!!
>
>Dear Sir:
>
>I have been requested by the Nigerian National Petroleum Company to contact you for assistance in resolving a matter. The Nigerian National Petroleum Company has recently concluded a large number of contracts for oil exploration in the sub-Sahara region. The contracts have immediately produced moneys equaling US$40,000,000. The Nigerian National Petroleum Company is desirous of oil exploration in other parts of the world, however, because of certain regulations of the Nigerian Government, it is unable to move these funds to another region.
>
>You assistance is requested as a non-Nigerian citizen to assist the Nigerian National Petroleum Company, and also the Central Bank of Nigeria, in moving these funds out of Nigeria. If the funds can be transferred to your name, in your United States account, then you can forward the funds as directed by the Nigerian National Petroleum Company. In exchange for your accommodating services, the Nigerian National Petroleum Company would agree to allow you to retain 10%, or US$4 million of this amount.
>
>However, to be a legitimate transferee of these moneys according to Nigerian law, you must presently be a depositor of at least US$100,000 in a Nigerian bank which is regulated by the Central Bank of Nigeria.
>
>If it will be possible for you to assist us, we would be most grateful. We suggest that you meet with us in person in Lagos, and that during your visit I introduce you to the representatives of the Nigerian National Petroleum Company, as well as with certain officials of the Central Bank of Nigeria.
>
>Please call me at your earliest convenience at 12-345-678. Time is of the essence in this matter; very quickly the Nigerian Government will realize that the Central Bank is maintaining this amount on deposit, and attempt to levy certain depository taxes on it.
>
>Yours truly,
>
>Prince Alyusi Islassis
