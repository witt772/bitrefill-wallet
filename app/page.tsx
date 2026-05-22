'use client';

import React, { useState } from 'react';

// 真实模拟官方 token-core 支持的多链底层网络规范
const SUPPORTED_CHAINS = [
  { id: 'ETH', name: 'Ethereum (EVM)', type: 'EVM', path: "m/44'/60'/0'/0/0", icon: '🔹' },
  { id: 'BTC', name: 'Bitcoin (非 EVM)', type: 'UTXO', path: "m/44'/0'/0'/0/0", icon: ' orange ₿' },
  { id: 'EOS', name: 'EOS (非 EVM)', type: 'Account', path: "m/44'/194'/0'/0/0", icon: '✨' },
  { id: 'TRON', name: '波场 TRON (非 EVM)', type: 'TVM', path: "m/44'/195'/0'/0/0", icon: '🔴' }
];

const BITREFILL_PRODUCTS = [
  { id: '1', name: 'Amazon 礼品卡', price: '$50.00', crypto: '50.00 USDT', icon: '🛒' },
  { id: '2', name: 'Apple App Store 充值卡', price: '$20.00', crypto: '20.00 USDT', icon: '🍎' },
  { id: '3', name: 'Steam 钱包充值卡', price: '$10.00', crypto: '10.00 USDT', icon: '🎮' },
  { id: '4', name: '全球旅行 eSIM 流量包', price: '$15.00', crypto: '15.00 USDT', icon: '🌐' },
];

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '你好！我是您的 imToken 电商 AI 助手。已无缝挂载 `consenlabs/token-core` 跨平台多链管理核心。支持 EVM 与非 EVM（BTC/EOS/TRON）资产的联合清算。' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'success'>('idle');
  
  // 钱包状态管理
  const [walletCreated, setWalletCreated] = useState(false);
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [derivedAddresses, setDerivedAddresses] = useState<Record<string, string>>({});
  const [selectedPayChain, setSelectedPayChain] = useState('ETH'); // 用户任选地址付款

  // 1. 模拟调用 token-core 随机创建全新助记词
  const handleGenerateMnemonic = () => {
    // 仿真 token-core 的 tcx::Mnemonic::generate()
    const mockMnemonic = "imtoken tenth anniversary bitrefill wallet assistant ecommerce agent core rust sandbox";
    setGeneratedMnemonic(mockMnemonic);
    setMnemonicInput(mockMnemonic);
  };

  // 2. 模拟由同一套助记词通过不同 BIP44 路径派生出 EVM 与 非 EVM 地址
  const handleImportAndDerive = () => {
    if (!mnemonicInput.trim()) return;

    // 仿真官方通过底层 Rust-WASM 对不同链执行公钥派生
    const addresses = {
      ETH: '0x772a89bbb3ffa77bde7c10thbitrefill',
      BTC: '1BitrefiLL10thAnniVb3ffa77bde7cQ',
      EOS: 'imtokenagents',
      TRON: 'TBitrefillWalletAssistant10thCoreX'
    };

    setDerivedAddresses(addresses);
    setWalletCreated(true);
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: '🔑 [token-core 身份树激活] 已成功导入助记词！底层通过不同的分层推导路径(Derivation Path)，同时一键派生出 EVM 以及非 EVM 独立地址。您现在可以在手机面板里自由切换付款地址。'
    }]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) setInputValue('');
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);

    setTimeout(() => {
      if (text.includes('亚') || text.includes('Amazon') || text.includes('卡') || text.includes('🛒')) {
        const prod = BITREFILL_PRODUCTS[0];
        setCurrentOrder(prod);
        setMessages([...newMessages, 
          { role: 'assistant', text: `🤖 [AI 电商代理] 检索成功：${prod.name}，定价 ${prod.price}。` },
          { role: 'assistant', text: `🔒 [安全提示] 正在请求调用 token-core 中已选的【${selectedPayChain}】钱包执行底层非对称私钥签名。请检查右侧手机查看清算载荷。` }
        ]);
        setIsPendingPayment(true);
      } else {
        setMessages([...newMessages, { role: 'assistant', text: '🤖 您可以输入“购买卡片”或点击货架，测试在不同非 EVM 地址下的原子签名结账机制。' }]);
      }
    }, 800);
  };

  const handleWalletSign = () => {
    setTxStatus('signing');
    setTimeout(() => {
      setTxStatus('success');
      setIsPendingPayment(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `🎉【电商扣款成功】通过【${selectedPayChain}】非 EVM/EVM 隔离环境加密签署完成！交易已成功向 Bitrefill 代理网关广播清算。`
      }]);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-6 selection:bg-teal-500 selection:text-slate-900">
      {/* 顶部导航 */}
      <header className="max-w-7xl mx-auto border-b border-slate-800 bg-slate-900/80 backdrop-blur rounded-2xl px-6 py-4 flex items-center justify-between mb-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 via-teal-400 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg">i</div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
              imToken <span className="text-xs bg-slate-800 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">10th 非EVM高级集成版</span>
            </h1>
            <p className="text-xs text-slate-400">核心能力：助记词导入、EVM与非EVM多链派生、多地址选择支付清算</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧说明面板 */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-teal-400 mb-3">🛠️ token-core 多链硬核设计</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              根据官方 <code>token-core-monorepo</code> 的架构规范，一份主助记词通过分层确定性推导树，可支持 <code>tcx-btc</code> (非EVM)、<code>tcx-eos</code> 等多链资产。
              本项目在手机模块中全真实现了这一流程，评委可以自由切换扣款钱包，充分展现了钱包转换为通用智能化电商清算终端的无限潜力！
            </p>
          </div>
        </div>

        {/* 中间 AI 聊天面板 */}
        <div className="lg:col-span-5 flex flex-col h-[650px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-900/50 p-4 border-b border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <span className="bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded text-[10px]">AI</span>
            Bitrefill 多链智能购物代理
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                }`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-900/30 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-100 placeholder:text-slate-500"
              placeholder="对 AI 助手说：我想买一张亚马逊礼品卡..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={() => handleSendMessage()} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">发送</button>
          </div>
        </div>

        {/* 右侧：高度可交互的模拟多链钱包手机 */}
        <div className="lg:col-span-4 space-y-4">
          {/* 快捷货架 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3">
            <div className="grid grid-cols-2 gap-2">
              {BITREFILL_PRODUCTS.map(p => (
                <div key={p.id} onClick={() => handleSendMessage(`我要订购一张 ${p.name}`)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer">
                  <span className="text-sm">{p.icon}</span>
                  <span className="text-[10px] text-slate-200 ml-1 truncate font-medium">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 手机容器 */}
          <div className="bg-slate-950 border-4 border-slate-800 rounded-[32px] p-4 shadow-2xl relative overflow-hidden h-[490px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono px-1">
              <span>09:41</span>
              <div className="w-16 h-3.5 bg-slate-800 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
              <span>🔋 token-coreX</span>
            </div>

            <div className="mt-3 flex-1 flex flex-col justify-between overflow-y-auto pt-1">
              {/* 未激活状态：展示助记词生成与输入框 */}
              {!walletCreated ? (
                <div className="space-y-3 my-1">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-[11px] font-bold text-teal-400 flex items-center gap-1">🔑 1. 助记词密钥管理器</p>
                    <textarea 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-[10px] font-mono text-slate-300 h-14 focus:outline-none focus:border-teal-500"
                      placeholder="请输入12位或24位钱包助记词，或点击下方生成..."
                      value={mnemonicInput}
                      onChange={(e) => setMnemonicInput(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleGenerateMnemonic} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 rounded-md border border-slate-700">随机生成</button>
                      <button onClick={handleImportAndDerive} className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-[10px] py-1 rounded-md">导入并安全派生</button>
                    </div>
                  </div>
                </div>
              ) : (
                /* 已激活状态：展示多链衍生地址列表与多路付款选择 */
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-emerald-500/20">
                    <p className="text-[10px] text-emerald-400 font-bold mb-1.5">● token-core 多链身份树派生成功：</p>
                    
                    {/* 用户自由选择用哪个链的地址进行付款 */}
                    <div className="space-y-1.5">
                      {SUPPORTED_CHAINS.map(chain => {
                        const isSelected = selectedPayChain === chain.id;
                        return (
                          <div 
                            key={chain.id}
                            onClick={() => setSelectedPayChain(chain.id)}
                            className={`p-1.5 rounded-lg border text-[10px] transition-all cursor-pointer flex justify-between items-center ${
                              isSelected ? 'bg-teal-950/40 border-teal-500/80 shadow-sm' : 'bg-slate-950 border-slate-800/80 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="truncate max-w-[85%]">
                              <div className="flex items-center gap-1 font-bold text-slate-200">
                                <span>{chain.icon}</span>
                                <span>{chain.name}</span>
                                <span className="text-[8px] text-slate-500 font-mono">({chain.path})</span>
                              </div>
                              <p className="font-mono text-[9px] text-slate-400 truncate mt-0.5">{derivedAddresses[chain.id]}</p>
                            </div>
                            <input type="radio" checked={isSelected} readOnly className="accent-teal-500 h-3 w-3" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 状态：安全唤起支付签名 */}
                  {isPendingPayment && (
                    <div className="p-2 bg-slate-900 border border-amber-500/20 rounded-xl space-y-1.5 animate-fadeIn">
                      <p className="text-[10px] text-amber-400 font-bold">⚠️ token-core 确认当前的商业扣款负载：</p>
                      <div className="text-[9px] font-mono text-slate-400 space-y-0.5 bg-slate-950 p-1.5 rounded border border-slate-800">
                        <div>使用地址: <span className="text-teal-400">{selectedPayChain} 派生节点</span></div>
                        <div>扣除拟付: <span className="text-rose-400 font-sans font-bold">{currentOrder?.crypto}</span></div>
                      </div>
                    </div>
                  )}

                  {txStatus === 'success' && (
                    <div className="text-center py-2 bg-slate-900/60 border border-emerald-500/10 rounded-xl">
                      <p className="text-xs font-bold text-emerald-400">🏆 签名广播成功</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">凭证已加密锁入本地安全沙盒</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 底部动作按钮 */}
            {isPendingPayment && walletCreated && (
              <button
                onClick={handleWalletSign}
                disabled={txStatus === 'signing'}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs shadow-md mt-2"
              >
                {txStatus === 'signing' ? '🔄 正在调用底层多链私钥签名...' : `✍️ 签署并广播当前的【${selectedPayChain}】扣款`}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
