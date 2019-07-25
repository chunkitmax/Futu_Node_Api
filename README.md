# Futu_Node_Api (In Progress)
This module automatically generates interfaces and class according to official release files.

## Install
```bash
npm install --save futu-api
```
or build locally
```bash
npm install
npm run build
```

## Usage
⚠️ Sometimes types on interface may be misleading because of poor definition in official protobuf files. Please refer to those files if you have trouble about types.  
For example (Qot_GetStaticInfo.proto):
```protobuf
message C2S
{
  optional int32 market = 1; //Qot_Common.QotMarket,股票市場
  optional int32 secType = 2; //Qot_Common.SecurityType,股票類型
  repeated Qot_Common.Security securityList = 3; //股票，若該字段存在，忽略其他字段，只返回該字段股票的靜態信息
}
```
According to this definition file, the output will be
```typescript
interface IC2S {
  /** C2S market */
  market?: (number|null);
  /** C2S secType */
  secType?: (number|null);
  /** C2S securityList */
  securityList?: (Qot_Common.ISecurity[]|null);
}

/** correction */
interface IC2S {
  /** C2S market */
  market?: (Qot_Common.QotMarket|null);
  /** C2S secType */
  secType?: (Qot_Common.SecurityType|null);
  /** C2S securityList */
  securityList?: (Qot_Common.ISecurity[]|null);
}
```
However, this module generates files from those proto files even there are mistakes.

⚠️ Protocol Name to Id table is from [Futu-Api-Doc](https://futunnopen.github.io/futu-api-doc/protocol/intro.html) . Some protocols have some protobuf files on official [py-futu-api repo](https://github.com/FutunnOpen/py-futu-api) but hidden on the table. You may extend the lookup table by yourselves (See the followiing example).

### Usage example:
```typescript
// TODO: Run FutuOpenD software first

import Futu, { Proto } from 'futu-api'
import UserConfig from '../user_config.json'

(async function main() {
  // extend the lookup table
  // add back protocol 'Qot_RequestHistoryKLQuota' with its protocol id
  let ft = new Futu(UserConfig, { 'Qot_RequestHistoryKLQuota': 3104 })
  // wait for initialization to finish
  await ft.waitForInit()
  // example 1: get static info
  let staticInfo = await ft.qotGetStaticInfo({
    market: Proto.Qot_Common.QotMarket.QotMarket_HK_Security,
    secType: Proto.Qot_Common.SecurityType.SecurityType_Warrant
  })
  console.log(staticInfo)
  // example 2: get snapshot of a list of securities.
  // we get snapshot of HK.00700 Tencent Holdings Ltd. here
  let snapshot = await ft.qotGetSecuritySnapshot({
    securityList: [
      {
        market: Proto.Qot_Common.QotMarket.QotMarket_HK_Security,
        code: '00700'
      }
    ]
  })
  console.log(snapshot)

  // example 3: protocol passed to constructor
  // get protocol "Qot_RequestHistoryKL" quota
  let quota = await ft.unknownProto(3104, {
    bGetDetail: true
  } as Proto.Qot_RequestHistoryKLQuota.IC2S) as Proto.Qot_RequestHistoryKLQuota.IS2C
  console.log(quota)
  // or you can pass name or id
  quota = await ft.unknownProto('Qot_RequestHistoryKLQuota', {
    bGetDetail: true
  } as Proto.Qot_RequestHistoryKLQuota.IC2S) as Proto.Qot_RequestHistoryKLQuota.IS2C
  console.log(quota)
  
  ft.close()
})()
```

## Test
```bash
# Require FutuOpenD software running
npm test
```