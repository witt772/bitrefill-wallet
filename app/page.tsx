'use client';

import React, { useState } from 'react';
import init, * as tcx from '@consenlabs/tcx-wasm';

export default function BitrefillWalletAssistant() {
  const [step, setStep] = useState<'home' | 'wallet'>('home');
  const [mnemonic, setMnemonic] = useState('');
  const [keystore, setKeystore] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const createRandomWallet = async () => {
    setLoading(true);
    try {
      await init();

      const result = tcx.create_keystore(JSON.stringify({
        password: "123456",
        mnemonic: "",           // 留空让 Token Core 随机生成
        network: "MAINNET"
      }));

      const ks = JSON.parse(result);
      const generatedMnemonic = ks.mnemonic;

      setKeystore(result);
      setMnemonic(generatedMnemonic);
      setStep('wallet');

      alert(`✅ 随机钱包创建成功！\n\n助记词（请立即备份）:\n\n${generatedMnemonic}\n\n测试密码: 123456`);
    } catch (err: any) {
      alert('生成失败: ' + (err?.message || '请刷新页面重试'));
    } finally {
      setLoading(false);
    }
  };

  const deriveAddresses = async () => {
    if (!keystore) return;
    setLoading(true);
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
    } catch (err: any) {
      alert('派生地址失败');
    } finally {
      setLoading(false);
    }
  };

  const openBitrefill = () => window.open('https://www.bitrefill.com/', '_blank');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto p-8">
        {step === 'home' && (
          <div className="text-center pt-20">
            <h1 className="text-5xl font-bold mb-4">🛍️ Bitrefill Wallet Assistant</h1>
            <p className="text-xl text-gray-400 mb-12">使用官方 Token Core tcx-wasm</p>

            <button 
              onClick={createRandomWallet}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-2xl px-16 py-8 rounded-3xl"
            >
              {loading ? '生成中...' : '🚀 随机生成新钱包'}
            </button>
          </div>
        )}

        {step === 'wallet' && (
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h2 className="text-2xl mb-6 text-emerald-400">✅ 钱包创建成功</h2>
              
              <div className="bg-black p-6 rounded-2xl mb-8">
                <p className="text-gray-400 mb-2">你的助记词（请备份）：</p>
                <p className="font-mono text-orange-400 break-words">{mnemonic}</p>
              </div>

              <button 
                onClick={deriveAddresses}
                disabled={loading}
                className="w-full bg-blue-600 py-4 rounded-2xl mb-6"
              >
                {loading ? '派生中...' : '显示 ETH / BTC / TRON 地址'}
              </button>

              {addresses.length > 0 && (
                <div className="space-y-3">
                  {addresses.map((a, i) => (
                    <div key={i} className="bg-zinc-950 p-4 rounded-xl font-mono text-sm">
                      {a.chain}: {a.address}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={openBitrefill}
              className="w-full bg-orange-500 text-black font-bold text-2xl py-8 rounded-3xl"
            >
              🛒 去 Bitrefill 购物
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
