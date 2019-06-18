# Set Up
*In case there are bugs with any dependencies, this serves as a log of any additional packages installed for this project*

## Front End

### React Native
```
npm install -g react-native-cli
react-native init FinTrack
react-native run-android 
```

### Native Base
```
npm install native-base --save
npm install react-native-vector-icons
react-native link
```

### React Navigation
```
npm install --save react-navigation
npm install --save react-native-gesture-handler
react-native link react-native-gesture-handler
```

### React Native Elements
```
npm install --save react-native-elements
npm install --save react-native-vector-icons
react-native link react-native-vector-icons
```

### Generate JSON (for mock data)
- [JSON generator](https://www.json-generator.com/)
- [JSON generator (next version)](https://next.json-generator.com/)

### Resetting node modules
```
rm -r node_modules
npm install
```

## Back End

### Libraries
- express
- body-parser
- mongodb
- mongoose
- bcrypt
- express-session
- passport
- passport-local
- passport-jwt
- jsonwebtoken
- nodemon (devDependency)
