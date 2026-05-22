'use client';

import React, { useState } from 'react';
import init, * as tcx from '@consenlabs/tcx-wasm';

export default function BitrefillWalletAssistant() {
  const [step, setStep] = useState<'home' | 'wallet'>('home');
  const [keystore, setKeystore] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  const createWallet = async () => {
    try {
      setStatus('正在加载 WASM...');
      await init();

      const ks = tcx.create_keystore(JSON.stringify({
        password: "123456",
        mnemonic: "",
        network: "MAINNET"
      }));

      setKeystore(ks);
      setStep('wallet');
      setStatus('✅ 钱包创建成功！（测试密码: 123456）');
      alert('测试钱包已创建！请勿在真实环境使用此 Demo 输入真实助记词。');
    } catch (err: any) {
      alert('创建失败: ' + err.message);
    }
  };

  const deriveAddresses = async () => {
    if (!keystore) return;
    try {
      await init();
      const result = tcx.derive_accounts(JSON.stringify({
        keystoreJson: keystore,
        key: "123456",
        derivations: [
          { chain: "ETHEREUM", derivationPath: "m/44'/60'/0'/0/0" },
          { chain: "BITCOIN", derivationPath: "m/84'/0'/0'/0/0", segWit: "VERSION_0" },
          { chain: "TRON", derivationPath: "m/44'/195'/0'/0/0" },
        ]
      }));

      setAddresses(JSON.parse(result));
      setStatus('地址派生成功');
    } catch (err: any) {
      alert('派生失败: ' + err.message);
    }
  };

  const openBitrefill = () => {
    window.open('https://www.bitrefill.com/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          🛍️ Bitrefill Wallet Assistant
        </h1>
        <p className="text-center text-xl mb-10 text-gray-400">让你的钱包成为电商助手 • Powered by Token Core tcx-wasm</p>

        {step === 'home' && (
          <div className="text-center">
            <button 
              onClick={createWallet}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-2xl px-16 py-8 rounded-2xl transition"
            >
              🚀 创建测试钱包并开始
            </button>
            <p className="mt-6 text-gray-500">使用官方 Token Core WASM 引擎</p>
          </div>
        )}

        {step === 'wallet' && (
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h2 className="text-2xl mb-6">✅ 你的自托管钱包已就绪</h2>
              <button 
                onClick={deriveAddresses}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg"
              >
                显示 ETH / BTC / TRON 地址
              </button>

              {addresses.length > 0 && (
                <div className="mt-6 space-y-4">
                  {addresses.map((a, i) => (
                    <div key={i} className="bg-black p-4 rounded-xl break-all">
                      <strong>{a.chain}：</strong> {a.address}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h2 className="text-3xl mb-4">🛒 Bitrefill 电商助手</h2>
              <p className="text-lg mb-8">从你的自托管钱包直接购买礼品卡、手机充值、eSIM 等</p>
              
              <button 
                onClick={openBitrefill}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold text-2xl py-8 rounded-2xl transition"
              >
                立即去 Bitrefill 购物
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              本 Demo 为 imToken 10 周年黑客松提交 · 请仅用于测试
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
