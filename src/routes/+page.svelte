<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { modal } from '$lib/appkit';
	import { accountState, networkState, appKitState, events, walletInfo } from '$lib/store';
	import { ethers } from 'ethers';
	import type { ContractRunner } from 'ethers';

	// List of contract addresses X chains
	const usdcAddresses = [
		{
			chainId: 42161, // Arbitrum One Mainnet
			address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
		},
		{
			chainId: 1, // Ethereum Mainnet
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
		},
		{
			chainId: 10, // Optimism Mainnet
			address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'
		},
		{
			chainId: 137, // Polygon PoS Mainnet
			address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
		},
		{
			chainId: 17000, // Holesky Testnet
			address: '0x449CDe79f489E2Ae32E6314d8D966CA64e040409'
		}
	];

	// A simplified ERC20 ABI.
	const usdcAbi = [
		'function name() view returns (string)',
		'function symbol() view returns (string)',
		'function decimals() view returns (uint8)',
		'function totalSupply() view returns (uint256)',
		'function approve(address spender, uint256 amount) public returns (bool)'
	];

	// Stores to store read data
	let name = writable<string>();
	let symbol = writable<string>();
	let decimals = writable<number>();
	let totalSupply = writable<string>();
	// Stores to store the pending and error states
	let loading = writable<boolean>(false);

	// Stores the current USDC address for a dyanmic chainId
	let USDCAddressForChainID: string;
	$: USDCAddressForChainID = usdcAddresses.find(
		(x) => x?.chainId === $networkState?.chainId
	)?.address;

	// Stores the current chainId in a seperate variable
	let currentNetworkID: Number;
	$: currentNetworkID = 0;
	// Subscribe to new connections and when the chainId changes.
	$: if ($accountState?.isConnected && $networkState?.chainId !== currentNetworkID) {
		console.log(`new connection or network changed, refetching state...`);
		readUSDC();
	}

	// When the chainId changes or is initialized then this method fetches USDC data
	async function readUSDC() {
		try {
			loading.set(true);

			// Get EIP-1193 provider from modal
			const eip1193Provider = (await modal?.getProvider?.(
				'eip155'
			)) as import('ethers').Eip1193Provider;
			if (!eip1193Provider) throw new Error('No provider from modal');

			const provider = new ethers.BrowserProvider(eip1193Provider);
			const contract = new ethers.Contract(USDCAddressForChainID, usdcAbi, provider);

			name.set(await contract.name());
			symbol.set(await contract.symbol());
			decimals.set(await contract.decimals());
			totalSupply.set(ethers.formatUnits(await contract.totalSupply(), await contract.decimals()));
		} catch (e: string) {
			console.error('Error reading token:', e);
		} finally {
			loading.set(false);
		}
	}

	// @dev: Removed reown theme, code left here as example to re-enable if wanted.
	// // Only update theme in browser
	// $: if (browser) {
	// 	document.documentElement.setAttribute('data-theme', $themeState.themeMode);
	// }

	onMount(async () => {
		// @dev: Removed reown theme, code left here as example to re-enable if wanted.
		// Set initial theme in browser
		// if (browser) {
		// 	document.documentElement.setAttribute('data-theme', $themeState.themeMode);
		// 	document.body.className = $themeState.themeMode;
		// }

		// @dev: Removed reown theme, code left here as example to re-enable if wanted.
		// modal?.subscribeTheme((state) => {
		// 	$themeState = state;
		// 	if (browser) {
		// 		document.documentElement.setAttribute('data-theme', state.themeMode);
		// 		document.body.className = state.themeMode;
		// 	}
		// });

		// @dev: Verbatim from reown
		modal?.subscribeAccount((state) => {
			$accountState = state;
		});
		// @dev: Verbatim from reown
		modal?.subscribeNetwork((state) => {
			$networkState = state;
		});
		// @dev: Verbatim from reown
		modal?.subscribeState((state) => {
			$appKitState = state;
		});
		// @dev: Verbatim from reown
		modal?.subscribeEvents((state) => {
			$events = state;
		});
		// @dev: Verbatim from reown
		modal?.subscribeWalletInfo((state) => {
			$walletInfo = state;
		});

		// When the page is loaded with a default network, then this logic fires
		currentNetworkID = $networkState.chainId;
		await readUSDC();
	});

	// @dev: Removed reown theme, code left here as example to re-enable if wanted.
	// function toggleTheme() {
	// 	const newTheme = themeState.themeMode === 'dark' ? 'light' : 'dark';
	// 	modal?.setThemeMode(newTheme);
	// 	$themeState = { ...$themeState, themeMode: newTheme };
	// 	if (browser) {
	// 		document.documentElement.setAttribute('data-theme', newTheme);
	// 		document.body.className = newTheme;
	// 	}
	// }

	// An arbitrary amount of USDC to approve
	let approvalAmount = ethers.parseUnits('100', 6);
	// Loader if the approval is ongoing
	let approveLoading: boolean = false;
	// Stores the transaction has of the approval
	let approveTxHash: string | null = null;
	//
	let error: string = '';

	// Performs an approval write operation on USDC contract
	async function approveToken() {
		loading.set(true);
		approveTxHash = null;

		try {
			// Get signer from the modal (Reown)
			if (!$accountState?.isConnected) return;
			// Get EIP-1193 provider from modal
			const eip1193Provider = (await modal?.getProvider?.(
				'eip155'
			)) as import('ethers').Eip1193Provider;
			if (!eip1193Provider) throw new Error('No provider from modal');

			const provider = new ethers.BrowserProvider(eip1193Provider);

			const usdc = new ethers.Contract(USDCAddressForChainID, usdcAbi, await provider.getSigner());
			const tx = await usdc.approve((await provider.getSigner()).address, approvalAmount);
			console.log('Approval tx sent:', tx.hash);
			approveTxHash = tx.hash;

			await tx.wait();
			console.log('Approval tx confirmed');
			approveTxHash = approveTxHash + ' - Approval tx confirmed';
		} catch (e: string) {
			error = e;
			console.error('Error approving token:', e);
		} finally {
			loading.set(false);
		}
	}
</script>

<h2 class="text-bold pt-10 text-center text-5xl">Sveltekit X Skeleton X Reown X Ethers v6</h2>
<div class="m-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
	<section class=" max-h-96 overflow-auto rounded-lg p-6 shadow-md sm:col-span-2">
		<h2 class="mb-6 text-center text-xl font-bold">Reown (formerly WalletConnect) Store Data</h2>
	</section>
	<section class=" max-h-72 overflow-auto rounded-lg p-6 shadow-md">
		<h2 class="mb-3 border-b pb-1 text-lg font-semibold">useAppKitAccount()</h2>
		<pre class="whitespace-pre-wrap break-words font-mono text-sm">{JSON.stringify(
				$accountState,
				null,
				2
			)}</pre>
	</section>

	<section class=" max-h-72 overflow-auto rounded-lg p-6 shadow-md">
		<h2 class="mb-3 border-b pb-1 text-lg font-semibold">useAppKitNetwork()</h2>
		<pre class="whitespace-pre-wrap break-words font-mono text-sm">{JSON.stringify(
				$networkState,
				null,
				2
			)}</pre>
	</section>

	<section class=" max-h-72 overflow-auto rounded-lg p-6 shadow-md">
		<h2 class="mb-3 border-b pb-1 text-lg font-semibold">useAppKitState()</h2>
		<pre class="whitespace-pre-wrap break-words font-mono text-sm">{JSON.stringify(
				$appKitState,
				null,
				2
			)}</pre>
	</section>

	<section class=" max-h-72 overflow-auto rounded-lg p-6 shadow-md">
		<h2 class="mb-3 border-b pb-1 text-lg font-semibold">useAppKitEvents()</h2>
		<pre class="whitespace-pre-wrap break-words font-mono text-sm">{JSON.stringify(
				$events,
				null,
				2
			)}</pre>
	</section>

	<section class=" max-h-96 overflow-auto rounded-lg p-6 shadow-md sm:col-span-2">
		<h2 class="mb-3 border-b pb-1 text-lg font-semibold">useWalletInfo()</h2>
		<pre class="whitespace-pre-wrap break-words font-mono text-sm">{JSON.stringify(
				$walletInfo,
				null,
				2
			)}</pre>
	</section>
</div>

<div class="m-10 grid grid-cols-4 gap-8">
	<section class="col-span-4 max-h-96 overflow-auto rounded-lg p-6 shadow-md">
		<h2 class="mb-6 text-center text-xl font-bold">Ethers@V6 read — USDC Contract</h2>
		<dl class="grid grid-cols-4 gap-4 text-sm">
			{#each [{ label: 'Name', value: $name }, { label: 'Symbol', value: $symbol }, { label: 'Decimals', value: $decimals }, { label: 'Total Supply', value: $totalSupply }] as item}
				<div class="col-span-1">
					<dt class="font-semibold">{item.label}</dt>
					<dd>{item.value ?? 'Loading...'}</dd>
				</div>
			{/each}
		</dl>
	</section>
</div>

<div class="m-10">
	<section class="rounded-lg p-6 shadow-md">
		<h2 class="mb-6 text-center text-xl font-bold">Ethers@V6 write — Approve USDC</h2>

		<div class="grid grid-cols-5 items-end gap-4 text-sm">
			<div class="col-span-2">
				<label class="mb-1 block font-semibold">Spender</label>
				<input
					bind:value={$accountState.address}
					class="w-full rounded border p-2"
					placeholder="0x..."
				/>
			</div>
			<div class="col-span-1">
				<label class="mb-1 block font-semibold">Amount</label>
				<input
					bind:value={approvalAmount}
					class="w-full rounded border p-2"
					placeholder="e.g. 100"
				/>
			</div>
			<div class="col-span-2">
				<button
					class="mt-5 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					on:click={approveToken}
					disabled={approveLoading}
				>
					{#if approveLoading}
						Approving...
					{:else}
						Approve USDC
					{/if}
				</button>
			</div>
		</div>

		{#if approveTxHash}
			<p class="mt-4 text-green-600">Transaction sent: {approveTxHash}</p>
		{/if}
		{#if error && error.trim() !== ''}
			<p class="col-span-5 mt-4 text-red-600">Error: {error}</p>
		{/if}
	</section>
</div>

<div class="m-10">
	<section class="rounded-lg p-6 shadow-md">
		<h2 class="mb-6 text-center text-xl font-bold">Technology Stack Docs</h2>
	</section>
	<div class="grid grid-cols-4 items-end gap-4 text-sm">
		<a href="https://svelte.dev/docs/kit/introduction" target="_blank" rel="noopener">
			<button type="button" class="preset-filled btn w-full">SvelteKit v2</button>
		</a>
		<a href="https://www.skeleton.dev/docs/get-started/introduction" target="_blank" rel="noopener">
			<button type="button" class="preset-filled btn w-full">Skeleton v3</button>
		</a>
		<a href="https://docs.reown.com/appkit/svelte/core/installation" target="_blank" rel="noopener">
			<button type="button" class="preset-filled btn w-full">Reown v1</button>
		</a>
		<a href="https://docs.ethers.org/v6/" target="_blank" rel="noopener">
			<button type="button" class="preset-filled btn w-full">Ethers v6</button>
		</a>
	</div>
</div>
