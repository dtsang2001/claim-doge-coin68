import { Button, Frog, TextInput } from 'frog'
import { Box, Heading, Text, Rows, Row, Divider, Image, Columns, Column, vars } from './ui.js'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/middlewares'

const SITE_URL = "https://claim-doge-coin68.vercel.app/";

export const app = new Frog({
  title: 'Claim DOGE!!!',
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  // Supply a Hub to enable frame verification.
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": "1b84f2299aa7c43ca955a5d5ce634e757",
      }
    }
  }
}).use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  }),
)

function MakeID(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.frame('/', async (c) => {  
  const { frameData } = c
  const { fid } = frameData || {} 
  var { username } = c.var.interactor || {};
  
  const ids = MakeID(7);

  var action = `/${fid}/doge${ids}`;

  return c.res({
    imageOptions: {
      height: 426,
      width: 816,
    },
    image: (
      <Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/bg.png")`}> 

        <Rows paddingTop="12" paddingRight="12" paddingLeft="12" paddingBottom="0" gap="8" grow>
          <Row height="6/7" > </Row>
          <Row height="1/7" alignVertical='bottom'> <Text size="12" align='right'>Good job!!! @{username}</Text> </Row>
        </Rows>
      </Box>
    ),
    intents: [
      <Button action={action} value='/'>Claim Doge Now</Button>
    ],
  })
})

app.frame('/:fid/:secret', async (c) => {

  const { req } = c

  const regex = /\/([0-9]*)\/doge[0-9a-zA-Z]*/gm;
  const fid = [...req.url.matchAll(regex)][0][1];
  
  var user = await fetch("https://client.warpcast.com/v2/user-by-fid?fid="+fid ,{ method:"GET" });
  var { result } = JSON.parse(await user.text()) || {};
  var { username } = result.user || {};

  var bg = Math.floor(Math.random() * 10);

  const ids = MakeID(7);
  const uriTip = "https://warpcast.com/dangs.eth/0x96d39fed";
  const uriShare = encodeURI(`https://warpcast.com/~/compose?text=Claim $DOGE!!!!&embeds[]=${SITE_URL}api/${fid}/doge${ids}`);

  return c.res({
    imageOptions: {
      height: 426,
      width: 816,
    },
    image: (
      <Box height="100%" width="100%" backgroundSize="816px 426px" backgroundRepeat='no-repeat' backgroundImage={`url("${SITE_URL}/${bg}.png")`}> 

        <Rows paddingTop="12" paddingRight="12" paddingLeft="12" paddingBottom="0" gap="8" grow>
          <Row height="6/7" > </Row>
          <Row height="1/7" alignVertical='bottom'> <Text size="12" align='right'>Good job!!! @{username}</Text> </Row>
        </Rows>
      </Box>
    ),
    intents: [
      <Button action="/" value='/'>Check Your</Button>,
      <Button.Link href={uriShare}>Share</Button.Link>
    ],
  })
})
// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
