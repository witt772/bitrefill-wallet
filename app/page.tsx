'use client';

import React, { useState } from 'react';
import init, * as tcx from '@consenlabs/tcx-wasm';

export default function BitrefillWallet() {
  const [step, setStep] = useState<'home' | 'wallet'>('home');
  const [mnemonic, setMnemonic] = useState('');
  const [keystore, setKeystore] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createRandomWallet = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('正在初始化 tcx-wasm...');
      await init();

      // Token Core 正确调用方式
      const params = {
        password: "123456",
        mnemonic: "",           // 留空 = 让 tcx-wasm 随机生成
        network: "MAINNET"
      };

      console.log('调用 create_keystore，参数:', params);
      const result = tcx.create_keystore(JSON.stringify(params));
      
      console.log('create_keystore 返回:', result);

      if (!result) {
        throw new Error('tcx-wasm 返回空结果');
      }

      const ks = typeof result === 'string' ? JSON.parse(result) : result;
      const generatedMnemonic = ks.mnemonic || ks.seed || '未能提取助记词';

      setKeystore(result);
      setMnemonic(generatedMnemonic);
      setStep('wallet');

      alert(`✅ 随机钱包创建成功！\n\n助记词（请立即备份）：\n\n${generatedMnemonic}\n\n测试密码: 123456`);
    } catch (err: any) {
      console.error('创建钱包失败:', err);
      const errMsg = err?.message || err?.toString() || '未知错误';
      setError(errMsg);
      alert('生成失败: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  const deriveAddresses = async () => {
    if (!keystore) return alert('请先创建钱包');
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
      alert('派生地址失败: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const openBitrefill = () => window.open('https://www.bitrefill.com/', '_blank');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {step === 'home' && (
          <div className="text-center py-20">
            <h1 className="text-5xl font-bold mb-6">🛍️ Bitrefill Wallet Assistant</h1>
            <p className="text-xl text-gray-400 mb-12">使用官方 Token Core tcx-wasm 构建</p>
            
            <button 
              onClick={createRandomWallet}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-black font-bold text-2xl px-16 py-8 rounded-3xl transition"
            >
              {loading ? '生成中...' : '🚀 随机生成新钱包'}
            </button>

            {error && <p className="text-red-500 mt-6">{error}</p>}
          </div>
        )}

        {step === 'wallet' && (
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400">✅ Token Core 钱包已创建</h2>
              
              <div className="bg-black p-6 rounded-2xl mb-8">
                <p className="text-sm text-gray-400 mb-3">助记词（请立即备份！）</p>
                <p className="font-mono text-orange-400 leading-relaxed break-all text-lg">{mnemonic}</p>
              </div>

              <button 
                onClick={deriveAddresses}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-lg mb-6"
              >
                {loading ? '派生中...' : '显示 ETH / BTC / TRON 地址'}
              </button>

              {addresses.length > 0 && (
                <div className="space-y-4">
                  {addresses.map((a, i) => (
                    <div key={i} className="bg-zinc-950 p-4 rounded-xl font-mono text-sm break-all">
                      <span className="text-emerald-400">{a.chain}：</span> {a.address}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={openBitrefill}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-2xl py-8 rounded-3xl"
            >
              🛒 去 Bitrefill 购物
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
