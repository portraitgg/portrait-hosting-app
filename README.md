# Portrait Hosting App

This repository contains the hosting node, which facilitates the decentralized hosting and distribution of data associated with Portraits. For more information about the Portrait Protocol and the app, visit our [documentation](https://learn.portrait.so).

## Download
To download the app, please use the following link for Mac (ARM) and Mac (x64):

- [Download for Mac (ARM)](https://portrait.host/ipfs/bafybeifu53gnzx3kr7246ol7hxbpv43vh42rbgrysklkenzvjrn6awktaq)
- [Download for Mac (x64)](https://portrait.host/ipfs/bafybeicvl5r3k5sgv2sdmshpuogry2mjsy63ivdljtbkhpe6tljhnq6bhi)

> Note: The app is currently in beta and only available for Mac. Support for other platforms will be considered in the future.

## Running the Portrait Hosting Node
Once you have downloaded the app and moved it to your Applications folder, you can run the Portrait Hosting Node by clicking on the app icon. The app will start running in the background, and you can access it from the menu bar.


### Running the app for the first time

### Unidentified Developer
When you run the app for the first time, you might see a message saying that the app is from an unidentified developer. You might need to allow the app to run on your Mac by going to System Preferences > Security & Privacy > General and clicking on "Open Anyway" next to the Portrait Hosting Node app. Or you can right-click on the app icon and select "Open" from the dropdown menu.

<img src="https://portrait.host/ipfs/bafkreigejcjfj7oanbpxhkz5keapw6uekwy5tn2zvisgvmhnqymtdg3pcu" width="300"/>

#### Keychain Access
The app requires access to the keychain to store your data locally. When you run the app for the first time, you will be prompted to allow the app to access the keychain. Click on "Always Allow" to grant access.

<table>
  <tr>
    <td><img src="https://portrait.host/ipfs/bafkreiacgzwe7gj2kiki67vsr5gvmnvkjytqziynconpe2mlxwchrgpxke" alt="Image 1" width="300"/></td>
    <td><img src="https://portrait.host/ipfs/bafkreidt3yd4btt3qsdeza52qh263tk26ui36pbagrxlymz525aur65pru" alt="Image 2" width="300"/></td>
  </tr>
</table>

> You will need to allow access to the keychain twice.

## Overview
Portrait Hosting Nodes are lightweight, efficient nodes designed to host and distribute data on the Portrait network. They utilize [Waku](https://github.com/waku-org/) to communicate with each other and ensure data availability and integrity. For more detailed information about the Portrait Protocol, Hosting Nodes, and the application layer, visit our [documentation](https://learn.portrait.so).


## Manual Installation and Setup

To install and run the Portrait Hosting Node on your local machine, manually follow these steps:

Installation
To install and run the Portrait Hosting Node, follow these steps:

1. Clone the repository to your local machine:
```sh
git clone https://github.com/portraitgg/portrait-hosting-app.git
```

2. Navigate to the project directory:
```sh
cd portrait-hosting-app
```

3. Install the necessary dependencies:
```sh
npm install
```

4. Build the application:
```
npm run build
```

5. Running the application

If you want to run the application in development mode, use the following command:
```sh
npm run start-electron
```

If you want to build the application for production, use the following command:
```sh
npm run make
```

## Contributing

Contributions are welcome. If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## Support
Please feel free to reach out to us via [Discord](https://discord.portrait.so) if you have any questions or need assistance.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
