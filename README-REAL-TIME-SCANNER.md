# 🚀 Real-time Signal Scanner

## Přehled

Real-time Signal Scanner je pokročilá komponenta pro identifikaci klíčových trading signálů na nízkých timeframech (5m, 15m, 1h). Komponenta je navržena pro včasné detekce rostoucích/klesajících trendů a pomáhá traderům vstoupit brzy na long/short pozice.

## Klíčové funkce

### 🔄 Real-time Monitoring
- **Automatické skenování** každých 30-300 sekund (nastavitelné)
- **Live aktualizace** signálů bez nutnosti manuálního refresh
- **Vizuální indikátor** stavu skenování (pulsující zelená/červená tečka)

### 📊 Pokročilá Analýza Signálů
- **Multi-timeframe analýza** (5m, 15m, 1h)
- **Confidence scoring** (0-100%) pro každý signál
- **Signal strength** klasifikace (weak/medium/strong)

### 🎯 Klíčové Indikátory
- **RSI** - oversold/overbought podmínky
- **MACD** - momentum a trend změny
- **ADX** - síla trendu
- **Volume Spike** - detekce zvýšeného objemu
- **Breakout/Breakdown** - detekce proražení úrovní
- **200 EMA** - dlouhodobý trend kontext

### 🔔 Alert System
- **Browser notifikace** pro high-confidence signály (≥80%)
- **Alert history** s možností vyčištění
- **Real-time alerts** bez nutnosti refresh stránky

## Použití

### Základní Použití
```html
<mag-real-time-scanner />
```

### Navigace
- **Dashboard**: `/dashboard` - kompletní dashboard s Real-time Scanner
- **Samostatná stránka**: `/real-time-scanner` - pouze Real-time Scanner

## Konfigurace

### Timeframe Selection
```typescript
selectedTimeframes = signal<string[]>(['tf5m', 'tf15m']);
```
- `tf5m` - 5 minutové timeframe
- `tf15m` - 15 minutové timeframe  
- `tf1h` - 1 hodinové timeframe

### Confidence Threshold
```typescript
signalThreshold = signal<number>(70); // 40-95%
```
- Minimální confidence pro zobrazení signálu
- Doporučeno: 70% pro kvalitní signály

### Scan Interval
```typescript
scanInterval = signal<number>(60); // 30-300 sekund
```
- Frekvence skenování
- Doporučeno: 60s pro low timeframe trading

### Max Signals
```typescript
maxSignals = signal<number>(20); // 10-50
```
- Maximální počet zobrazených signálů
- Doporučeno: 20 pro přehlednost

## Filtry

### Signal Type Filter
- **All** - všechny signály
- **🚀 Bullish** - pouze bullish signály
- **📉 Bearish** - pouze bearish signály

### Strength Filter
- **All** - všechny síly
- **Strong** - pouze silné signály (≥80% confidence)
- **Medium** - střední signály (60-79% confidence)
- **Weak** - slabé signály (40-59% confidence)

### Volume Spike Filter
- **Enabled** - pouze signály s volume spike >1.5x
- **Disabled** - všechny signály

### Breakout Filter
- **Enabled** - pouze signály s breakout/breakdown
- **Disabled** - všechny signály

## Signal Analysis Logic

### Confidence Scoring
```typescript
// RSI Analysis (0-20 points)
if (rsi < 30) confidence += 20; // Oversold
if (rsi > 70) confidence += 20; // Overbought

// MACD Analysis (0-15 points)
if (macdHist > 0.001) confidence += 15; // Bullish
if (macdHist < -0.001) confidence += 15; // Bearish

// ADX Analysis (0-10 points)
if (adx > 25) confidence += 10; // Strong trend

// Volume Analysis (0-15 points)
if (volumeSpike > 1.5) confidence += 15;

// Breakout Analysis (0-20 points)
if (isBreakout || isBreakdown) confidence += 20;

// Price Change Analysis (0-10 points)
if (Math.abs(changePercent) > 2) confidence += 10;

// 200 EMA Analysis (0-10 points)
if (isAbove200Ema && bullish) confidence += 10;
if (!isAbove200Ema && bearish) confidence += 10;
```

### Signal Strength Classification
- **Strong**: ≥80% confidence
- **Medium**: 60-79% confidence  
- **Weak**: 40-59% confidence

## UI Komponenty

### Control Panel
- **Start/Stop** tlačítko pro skenování
- **Notification** tlačítko pro povolení notifikací
- **Timeframe** výběr
- **Confidence threshold** slider
- **Scan interval** slider
- **Max signals** slider

### Statistics Panel
- **Bullish Signals** počet
- **Bearish Signals** počet
- **High Confidence** počet
- **Alerts** počet

### Signals Table
- **Symbol** - trading pár
- **TF** - timeframe
- **Signal** - typ signálu s ikonou
- **Price** - aktuální cena
- **Change** - procentuální změna
- **RSI** - RSI hodnota
- **MACD** - MACD histogram
- **ADX** - ADX hodnota
- **Volume** - volume spike násobek
- **Confidence** - confidence score
- **Chart** - odkaz na TradingView

### Alerts Section
- **High confidence alerts** (≥80%)
- **Real-time notifications**
- **Alert history** s timestamp
- **Clear all** funkce

## Technické Detaily

### Komponenty
- `RealTimeScanner` - hlavní komponenta
- `RealTimeScannerPage` - samostatná stránka
- `RealTimeSignal` - interface pro signály

### Services
- `ScreenerService` - data fetching
- `ScreenerStore` - state management

### Signals (Angular 17+)
- `isScanning` - stav skenování
- `realTimeSignals` - aktuální signály
- `alertSignals` - alert historie
- `filteredSignals` - computed filtrované signály

## Best Practices

### Pro Low Timeframe Trading
1. **Nastavte interval na 60s** pro včasné detekce
2. **Používejte 5m a 15m** timeframes
3. **Nastavte threshold na 70%** pro kvalitní signály
4. **Povolte volume spike filter** pro lepší signály
5. **Povolte breakout filter** pro trend změny

### Pro Swing Trading
1. **Nastavte interval na 300s** (5 minut)
2. **Používejte 1h timeframe**
3. **Nastavte threshold na 80%** pro vysokou kvalitu
4. **Filtrujte pouze strong signály**

### Risk Management
- **Nikdy neobchodujte pouze na základě signálů**
- **Vždy používejte stop-loss**
- **Kombinujte s dalšími analýzami**
- **Testujte na demo účtu**

## Troubleshooting

### Skenování se nezastaví
- Zkontrolujte `ngOnDestroy` lifecycle
- Restartujte aplikaci

### Žádné signály
- Snižte confidence threshold
- Zkontrolujte filtry
- Zkontrolujte API připojení

### Notifikace nefungují
- Povolte notifikace v prohlížeči
- Zkontrolujte `Notification.permission`

## Future Enhancements

### Plánované Funkce
- **Custom signal strategies**
- **Backtesting module**
- **Performance tracking**
- **Email alerts**
- **Telegram integration**
- **Advanced filters**
- **Signal history export**

### Možná Rozšíření
- **Machine learning** pro lepší predikce
- **Social sentiment** analýza
- **News impact** scoring
- **Correlation analysis**
- **Portfolio optimization** 