{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE RecursiveDo           #-}
{-# LANGUAGE ScopedTypeVariables   #-}
{-# LANGUAGE DeriveGeneric         #-}
{-# LANGUAGE TemplateHaskell       #-}
{-# LANGUAGE PartialTypeSignatures #-}
{-# LANGUAGE KindSignatures        #-}
{-# LANGUAGE FlexibleContexts      #-}

module Lib (app) where

import Reflex
import Reflex.Dom
import GHC.Generics
import qualified Data.Text as T
import Data.Maybe (maybeToList)
import Data.Aeson
import Data.FileEmbed
import qualified Data.ByteString.Lazy as BSL
import qualified Data.ByteString as BS
import Data.Default
import Data.List (sortOn)
import Control.Monad.Fix (MonadFix)

app :: IO ()
app = mainWidgetWithCss $(embedFile "styles/main.css") $ do
  rec let subscribeMessage = fmap (\_ -> ["{\"type\": \"subscribe\",\"product_id\": \"BTC-USD\"}"]:: [T.Text]) $  _webSocket_open ws
      ws <- webSocket ("wss://ws-feed.gdax.com"::T.Text) $ def & webSocketConfig_send .~ subscribeMessage
  receivedMessages <- foldDyn accumulateMessages [] $ _webSocket_recv ws
  header
  rec
    stats buy sell
    buy  <- pricePanel "Buy Orders" id $ buyOrders  <$> receivedMessages
    sell <- pricePanel "Sell Orders" reverse $ sellOrders <$> receivedMessages
  text ""

data Message = Message {
    order_id :: T.Text
  , side :: T.Text
  , price :: T.Text
  , size :: T.Text
  , message_type :: T.Text
               } deriving (Generic, Show)

instance FromJSON Message where
  parseJSON (Object o) = Message <$> o .: "order_id"
                                 <*> o .: "side"
                                 <*> o .: "price"
                                 <*> o .: "remaining_size"
                                 <*> o .: "type"
  parseJSON _          = fail "Failed to parse message"

data Stats = Stats {
    totalCash :: Double
  , totalCoin :: Double
  , netCash   :: Double
  , netCoin   :: Double
                   } deriving (Show)

instance Default Stats where
  def = Stats 0.0 0.0 0.0 0.0

pricePanel :: forall (m :: * -> *) t. (Control.Monad.Fix.MonadFix m, MonadHold t m, PostBuild t m, DomBuilder t m) =>
  T.Text -> MessageFilter -> Dynamic t [Message] -> m (Dynamic t [Event t (Event t ())])
pricePanel panelHeader fn feed = elClass "div" "panel" $ do
  let feed' = fmap (fn . sortOn price)  feed
  el "h2" $ text panelHeader
  el "h3" $ dynText $ fmap (T.append "Open Orders: " . T.pack . show . length) feed'
  simpleList feed' $ \m ->
    dyn $ priceEntry <$> m

priceEntry :: forall (m :: * -> *) t. DomBuilder t m => Message -> m (Event t ())
priceEntry msg = elClass "div" "priceEntry" $ do
  el "p" $ do
    text "Price:"
    el "span" $ text $ price msg
    el "span" $ text $ T.append "QTY:" $ size msg
    button "take order"

header :: MonadWidget t m => m ()
header = elAttr "div" ("id" =: "title") $ el "h1" $ text "Welcome to Coin Stream!"

stats :: MonadWidget t m => a -> b -> m ()
stats _ _ = statsTemplate def

statsTemplate :: forall (m :: * -> *) t. DomBuilder t m => Stats -> m ()
statsTemplate s = elClass "div" "stats" $ do
  el "h2" $ text "your stats:"
  el "ul" $ do
    el "li" $ text $ T.append "Total Cash: " (T.pack $ show $ totalCash s)
    el "li" $ text $ T.append "Total Coin: " (T.pack $ show $ totalCoin s)
    el "li" $ text $ T.append "Net Cash: " (T.pack $ show $ netCash s)
    el "li" $ text $ T.append "Net Coin: " (T.pack $ show $ netCoin s)

accumulateMessages :: BS.ByteString -> [Message] -> [Message]
accumulateMessages msg msgs =
  let newMessages = (decodeMessage msg)
      open = filter ((== "open") . message_type) newMessages
      done = order_id <$> filter ((== "done") . message_type) newMessages
  in  filter (not . flip elem done . order_id) open ++ msgs
decodeMessage :: BS.ByteString -> [Message]
decodeMessage = maybeToList . decode . BSL.fromStrict

type MessageFilter = [Message] -> [Message]

sellOrders :: MessageFilter
sellOrders = filter ((== "sell") . side)

buyOrders :: MessageFilter
buyOrders = filter ((== "buy") . side)
