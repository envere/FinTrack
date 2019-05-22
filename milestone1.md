# Milestone 1

*Proposed Orbital Tier: * Apollo 11

## Overview
This is a stock portfolio tracker that helps users to conveniently track their financial assets independent of brokerage accounts.
Users will be able to create accounts and fill in their respective data.
The app will display graphs to visualise users' portfolio and track users' dividends.

## Motivation
Keeping track of your stock portfolio can be tiresome and inconvenient especially if you have multiple brokerage accounts.
This app, like many other stock portfolio apps out in the market, aims to be a convenient stop for users to collate their data in a single app.

## Features
- Dividend Tracker
- Data Visualisation

## System Design
- Database
  - talk to finance API for pseudo-real-time data
  - hold users' account data
- UI
  - home page functionality
    - add stock
    - view overall portfolio
    - go to list of transactions
  - list of transactions
    - view transactions

## Technologies
- Android App built with React-Native
- DataBase (third party) supported by FireBase
