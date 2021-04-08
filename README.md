### 介紹

此 Demo 是為了展示 [Code-Push](https://github.com/microsoft/react-native-code-push) 的流程更新以及發生錯誤要如何處理，環境設定只用了 Android，iOS 需要另外設定。

更詳細的資訊請見 => [Code-Push wiki](https://www.notion.so/Code-Push-Wiki-0e28c5077eca4dea92d29eddca273b12)

### Demo 說明

- 紫色區塊 UI：為 code-push 控制區，純供測試用途
  - version
    - App 目前的版本，前三碼為 native version，最後一個數字為 code-push release label number
    - 如果是全新剛 build 出來的版本，應該為 `1.0.0`
  - 藍色按鈕
    - 測試不同 sync 流程
  - 粉紅色按鈕
    - 測試發生 Error 的狀況

![image-20210408164334625](https://i.loli.net/2021/04/08/i2G7LZ9gcOMYqpj.png)

---

### 環境設置

- 下載 demo，安裝 package
- [註冊 app center 帳號](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli#account-management)
- 給我 email，我會再加入專案 MyApp-Android 的協作成員裡 Collaborators
- 設置 current project
  - 之後就不用每次都要下 `-a <ownerName>/MyApp-Android ` 
  - `appcenter apps set-current <ownerName>/MyApp-Android`
- 就可以進行測試了！

>註：因為只是 demo，所以把 `*.keystore` 從 `.gitignore` 拿掉了
>

---

### 測試 Staging 步驟：

1. 打包 Staging App
2. 做一些更動
3. 發佈到 Code-Push Server
4. 安裝步驟 (1. ) 的 Staging App
5. 測試更新是否正常安裝
6. 測試當 App Crash 時，Error Boundary 有沒有成功接到錯誤

---

#### 1. 包出 Staging App

```shell
npm run android:releaseStaging
```

##### 補充 1：對應到 package.json

```json
{
    ...
    "scripts": {
        //                                                                           ↓ 對應到 buildTypes
        "android:releaseStaging": "yarn gradle:clean && cd android && ./gradlew app:assembleReleaseStaging",
    }
}
```

##### 補充 2：`./gradlew app:assemble<buildType>`  會對應到 `android/app/build.gradle` 的 buildTypes

```groovy
buildTypes {
    debug {
        ...
        resValue "string", "CodePushDeploymentKey", '' // 開發模式不接收 code-push 更新
    }
    release {
        ...
        resValue "string", "CodePushDeploymentKey", '1K8l-AQAKknBjO4EbdNLFkd2ZonRDutR2Mxpc'
    }
    releaseStaging.initWith(release)
    releaseStaging {
        resValue "string", "CodePushDeploymentKey", 'EmwrhpfmWFI7ZONFSF4WwHuRMYn050dCYm1uC'
        matchingFallbacks = ['release']
    }
}
```

> 註：buildTypes 可以任意命名，但 [名稱一定要包含 `release`](https://github.com/facebook/react-native/blob/master/react.gradle#L160)

### 2. 做一些更動...

### 3.  發佈新版本到 Code-Push Server

- 預設就是 push 到 Staging 環境，所以不用特別指定環境
- CLI 更多參數 => 參考[這裡](https://www.notion.so/Management-CLI-102e402d98934701a9ee5f9fa97755b0#7f96546fc8154f9aa72b8db2c6792c7b)

```shell
appcenter codepush release-react --description 'XXX'
```

### 4.  安裝步驟 (1. ) 的 Staging App

```shell
npm run android:installRelease
```

如果不想要下指令安裝，也可以用 apk 裝，位置在 `android/app/build/outputs/apk/release/app-release.apk` 

### 5.  測試更新是否正常安裝

- 打開安裝完的 App

- sync 的幾種方式
  - 點擊藍色按鈕：
    - Resource ready => sync on next suspend
    - Incompatible code-push version => sync immediately
  - 當 App 從背景回到前景 => sync on next suspend
  
- 有成功更新的話，App Version 應該會多一位 => `1.0.0.<release-lable>`

  ![image-20210408164147891](https://i.loli.net/2021/04/08/rsuzY85WjknG6RT.png)

### 6. 測試當 App Crash 時，Error Boundary 有沒有成功接到錯誤

- 點擊粉紅色按鈕
- 如果 Error Boundary 有成功接到的話，應該會出現錯誤訊息 Popup

![image-20210408163901392](https://i.loli.net/2021/04/08/S84wEGmD3576Hij.png)



