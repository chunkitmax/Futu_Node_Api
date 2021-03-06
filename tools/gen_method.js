const ProtoName2Id = require('../src/proto/protoid.json')
const Proto = require('../src/proto/proto')

const content = Object.entries(ProtoName2Id).map(([key, value]) => `
  public async ${key[0].toLowerCase() + key.slice(1).replace('_', '')}(${Proto[key].Request? `req: ApiParam<Proto.${key}.IC2S>` : ''}): Promise<Proto.${key}.IS2C> {
    return super.request('${key}'${Proto[key].Request? `, req` : ''})
  }
`).join('')

console.log(content)
console.log('Finished!')
