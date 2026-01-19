<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import WalletConnect from '$lib/components/WalletConnectClient.svelte';
	import { accountState, networkState, appKitState, events, walletInfo } from '$lib/store';

	import {
		Github,
		Linkedin,
		Twitter,
		Youtube,
		Instagram,
		FileText,
		Rocket,
		GraduationCap,
		Send,
		BadgeCheck,
		Briefcase,
		Mic,
		Video
	} from '@lucide/svelte';

	import { modal } from '$lib/appkit';

	import Telegram from '$lib/components/icons/Telegram.svelte';
	import TikTok from '$lib/components/icons/TiktokIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import Discord from '$lib/components/icons/Discord.svelte';

	let theme = $state<'light' | 'dark' | 'system'>('system');
	let resolvedTheme = $state<'light' | 'dark'>('dark');

	function triggerConfetti() {
		const colors = ['#06b6d4', '#8b5cf6'];
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors
		});
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
		theme = savedTheme || 'system';
		updateTheme();

		console.log('modal', modal);

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

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', updateTheme);

		// Listen for theme cycle events from layout
		const handleThemeCycle = (e: Event) => {
			const customEvent = e as CustomEvent;
			theme = customEvent.detail.theme;
			updateTheme();
		};
		window.addEventListener('theme-change', handleThemeCycle);

		return () => {
			mediaQuery.removeEventListener('change', updateTheme);
			window.removeEventListener('theme-change', handleThemeCycle);
		};
	});

	function updateTheme() {
		if (theme === 'system') {
			resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} else {
			resolvedTheme = theme;
		}
		document.documentElement.setAttribute('data-theme', resolvedTheme);
		localStorage.setItem('theme', theme);
	}

	const socials = [
		{
			name: 'GitHub',
			handle: '@vdud',
			url: 'https://github.com/vdud',
			icon: Github
		},
		{
			name: 'Twitter',
			handle: '@varundudeja96',
			url: 'https://x.com/varundudeja96',
			icon: XIcon
		},
		{
			name: 'Instagram',
			handle: '@vrx_ui',
			url: 'https://instagram.com/vrx_ui',
			icon: Instagram
		},
		{
			name: 'LinkedIn',
			handle: 'Varun Dudeja',
			url: 'https://linkedin.com/in/varun-dudeja-3ba254142',
			icon: Linkedin
		},
		{
			name: 'YouTube',
			handle: '@Varun-Dudeja',
			url: 'https://youtube.com/@Varun-Dudeja',
			icon: Youtube
		},
		{
			name: 'Telegram',
			handle: '@vrx_ui',
			url: 'https://t.me/+T8aZl-FKrqYzYWVl',
			icon: Telegram
		},
		{
			name: 'TikTok',
			handle: '@vrx_ui',
			url: 'https://www.tiktok.com/@vrx_ui?_r=1&_t=ZS-93CfowrXo5C',
			icon: TikTok
		},
		{
			name: 'Discord',
			handle: 'The Freelance University (x_u)',
			url: 'https://discord.gg/GfPD3jfy',
			icon: Discord
		}
	];

	// const contentItems = [
	// 	{
	// 		type: 'Blog',
	// 		title: 'Building with SvelteKit',
	// 		description: 'Deep dive into modern web development patterns',
	// 		url: '#',
	// 		icon: FileText
	// 	},
	// 	{
	// 		type: 'Project',
	// 		title: 'Web3 Portfolio',
	// 		description: 'Blockchain-enabled portfolio with Reown integration',
	// 		url: '#',
	// 		icon: Rocket
	// 	},
	// 	{
	// 		type: 'Tutorial',
	// 		title: 'Smart Contracts 101',
	// 		description: 'Learn the basics of Solidity development',
	// 		url: '#',
	// 		icon: GraduationCap
	// 	}
	// ];

	const services = [
		{
			title: 'Consulting',
			description: 'Strategic technical guidance for web projects, architecture & implementation.',
			price: 'Starting at $150/hour',
			icon: Briefcase,
			subject: 'Consulting Inquiry',
			body: "Hi Varun,\n\nI'm interested in consulting for my project:\n- Timeline: \n- Budget: \n- Needs: \n\nBest regards,"
		},
		{
			title: 'Event Speaking',
			description: 'Keynotes & talks on Web3, modern web dev & creative coding.',
			price: 'Starting at $1000/event',
			icon: Mic,
			subject: 'Speaking Request',
			body: 'Hi Varun,\n\nEvent details:\n- Name: \n- Date: \n- Audience: \n- Topic: \n\nBest regards,'
		},
		{
			title: 'Live Interviews',
			description: 'Podcasts, live streams & interviews about tech & creativity.',
			price: 'Starting at $500/session',
			icon: Video,
			subject: 'Interview Request',
			body: 'Hi Varun,\n\nInterview details:\n- Platform: \n- Duration: \n- Topic: \n\nBest regards,'
		}
	];

	// Helper for mailto links
	function getMailtoLink(service: (typeof services)[0]) {
		const subject = encodeURIComponent(service.subject);
		const body = encodeURIComponent(service.body);
		return `mailto:varundudeja95@gmail.com?subject=${subject}&body=${body}`;
	}

	const emailSubject = encodeURIComponent("Let's work together!");
	const emailBody = encodeURIComponent(
		'Hi Varun,\n\nI came across your portfolio and would love to discuss a potential project.\n\nBest regards'
	);
</script>

<section
	id="home"
	class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 sm:px-6"
>
	<div
		class="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"
	></div>

	<div class="relative z-10 w-full max-w-4xl">
		<div class="grid items-center gap-8 md:grid-cols-2 md:gap-12">
			<div class="float order-1 flex justify-center md:order-2">
				<div class="group relative">
					<div
						class="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50 blur-md transition-opacity group-hover:opacity-75"
					></div>
					<div
						class="relative h-48 w-48 overflow-hidden rounded-full border-2 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72"
						style="border-color: var(--border-color);"
					>
						<img src="/Dp.webp" alt="Varun Dudeja" class="h-full w-full object-cover" />
					</div>
					<div
						class="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 sm:px-4 sm:py-1.5"
						style="background-color: var(--bg-primary); border-color: var(--accent);"
					>
						<span class="flex items-center gap-2 font-mono text-xs">
							<span class="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
							<span style="color: var(--text-secondary);">Available</span>
						</span>
					</div>
				</div>
			</div>

			<div class="order-2 text-center md:order-1 md:text-left">
				<p
					class="mb-3 font-mono text-xs tracking-wider sm:mb-4 sm:text-sm"
					style="color: var(--accent);"
				>
					// HELLO WORLD
				</p>
				<h1
					class="mb-3 text-4xl font-bold leading-tight sm:mb-4 sm:text-5xl md:text-6xl"
					style="color: var(--text-primary);"
				>
					I'm <span class="gradient-text">Varun</span>
				</h1>
				<p
					class="glitch mb-4 text-xl sm:mb-6 sm:text-2xl md:text-3xl"
					style="color: var(--text-secondary);"
					data-text="Web Developer"
				>
					Web Developer<span class="terminal-cursor"></span>
				</p>
				<p
					class="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg"
					style="color: var(--text-muted);"
				>
					Full-stack developer & creative. Building with
					<span style="color: var(--accent-secondary);">Svelte</span>,
					<span style="color: var(--accent);">Web3</span>, and
					<span class="text-pink-400">pixels</span>.
				</p>
				<div
					class="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:justify-start"
				>
					<div class="wallet-connect-wrapper w-full sm:w-auto">
						<WalletConnect isInNav={false} />
					</div>
					<a
						href="#socials"
						class="flex w-full justify-center rounded-lg border px-6 py-3 text-center font-medium transition-all sm:w-auto"
						style="border-color: var(--border-color); color: var(--text-secondary);"
					>
						<BadgeCheck class="mr-2 h-5 w-5 self-center" /> See Socials
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="about" class="relative px-4 py-16 sm:px-6 sm:py-24 md:py-32">
	<div class="mx-auto max-w-3xl">
		<p class="mb-2 font-mono text-xs sm:text-sm" style="color: var(--accent);">01.</p>
		<h2 class="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl" style="color: var(--text-primary);">
			About <span style="color: var(--text-muted);">me</span>
		</h2>
		<div class="grid gap-8 md:grid-cols-[2fr_1fr] md:gap-12">
			<div
				class="space-y-4 text-base leading-relaxed sm:space-y-6 sm:text-lg"
				style="color: var(--text-secondary);"
			>
				<p>
					I bridge the gap between <span style="color: var(--text-primary);"
						>code and creativity</span
					>. From crafting sleek frontends with Svelte to diving into Web3 smart contracts, I bring
					ideas to life across the entire stack.
				</p>
				<p>
					When I'm not coding, you'll find me pushing pixels in After Effects or building 3D worlds
					in Blender. <span style="color: var(--accent);"
						>The best products happen when technical skill meets artistic vision.</span
					>
				</p>
			</div>
			<div class="space-y-4">
				<div class="code-block rounded-lg p-3 font-mono text-xs sm:p-4">
					<p style="color: var(--text-muted);">// Quick stats</p>
					<p style="color: var(--text-secondary);" class="mt-2">
						stack: <span style="color: var(--accent);">full</span>
					</p>
					<p style="color: var(--text-secondary);">
						creative: <span style="color: var(--accent-secondary);">true</span>
					</p>
					<p style="color: var(--text-secondary);">
						web3: <span class="text-green-400">enabled</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section
	id="socials"
	class="px-4 py-16 sm:px-6 sm:py-24 md:py-32"
	style="background-color: var(--bg-tertiary);"
>
	<div class="mx-auto max-w-4xl">
		<p class="mb-2 font-mono text-xs sm:text-sm" style="color: var(--accent);">02.</p>
		<h2 class="mb-8 text-2xl font-bold sm:mb-12 sm:text-3xl" style="color: var(--text-primary);">
			Connect & <span style="color: var(--text-muted);">Explore</span>
		</h2>

		<!-- Social Links -->
		<div class="mb-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
			{#each socials as social}
				<a
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex h-16 w-16 items-center justify-center rounded-xl transition-all hover:scale-110 sm:h-20 sm:w-20"
					style="background-color: var(--bg-card);"
					aria-label={social.name}
				>
					<svelte:component
						this={social.icon}
						class="group-hover:text-accent h-7 w-7 transition-colors"
						style="color: var(--text-secondary);"
					/>
				</a>
			{/each}
		</div>

		<!-- Content/Projects Grid -->
		<!-- <h3 class="mb-6 text-lg font-semibold" style="color: var(--text-primary);">Latest Content</h3>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each contentItems as item}
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:border-accent group overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1"
					style="border-color: var(--border-color); background-color: var(--bg-card);"
				>
					<div
						class="flex h-32 w-full items-center justify-center"
						style="background-color: var(--bg-secondary);"
					>
						<svelte:component
							this={item.icon}
							class="h-12 w-12 opacity-30 transition-opacity group-hover:opacity-50"
							style="color: var(--text-muted);"
						/>
					</div>
					<div class="p-5">
						<span
							class="mb-2 inline-block rounded-full px-3 py-1 font-mono text-xs"
							style="color: var(--accent); background-color: var(--accent); opacity: 0.1;"
						>
							{item.type}
						</span>
						<h4 class="mb-2 text-lg font-semibold" style="color: var(--text-primary);">
							{item.title}
						</h4>
						<p class="text-sm leading-relaxed" style="color: var(--text-muted);">
							{item.description}
						</p>
					</div>
				</a>
			{/each}
		</div> -->
	</div>
</section>

<section id="services" class="px-4 py-16 sm:px-6 sm:py-24 md:py-32">
	<div class="mx-auto max-w-4xl">
		<p class="mb-2 font-mono text-xs sm:text-sm" style="color: var(--accent);">03.</p>
		<h2 class="mb-8 text-2xl font-bold sm:mb-12 sm:text-3xl" style="color: var(--text-primary);">
			Services I <span style="color: var(--text-muted);">Offer</span>
		</h2>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each services as service}
				<a
					href={getMailtoLink(service)}
					onclick={triggerConfetti}
					class="hover:border-accent group overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1"
					style="border-color: var(--border-color); background-color: var(--bg-card);"
				>
					<svelte:component
						this={service.icon}
						class="group-hover:text-accent mb-4 h-12 w-12 transition-colors"
						style="color: var(--accent);"
					/>
					<h3 class="mb-2 text-xl font-bold" style="color: var(--text-primary);">
						{service.title}
					</h3>
					<p class="mb-4 text-base leading-relaxed" style="color: var(--text-muted);">
						{service.description}
					</p>
					<p class="font-mono text-sm" style="color: var(--accent);">{service.price}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<section
	id="contact"
	class="px-4 py-16 sm:px-6 sm:py-24 md:py-32"
	style="background-color: var(--bg-tertiary);"
>
	<div class="mx-auto max-w-3xl">
		<p class="mb-2 font-mono text-xs sm:text-sm" style="color: var(--accent);">04.</p>
		<h2 class="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl" style="color: var(--text-primary);">
			Let's <span class="gradient-text">connect</span>
		</h2>
		<p class="mb-8 max-w-xl text-base sm:mb-10 sm:text-lg" style="color: var(--text-secondary);">
			Got a project that needs that extra something? Whether it's a web app, smart contract, or
			creative work—let's build something amazing.
		</p>

		<div class="flex flex-wrap items-center gap-4 sm:gap-6">
			<a
				href="mailto:varundudeja95@gmail.com?subject={emailSubject}&body={emailBody}"
				class="group inline-flex w-full items-center gap-3 rounded-xl border bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-3 transition-all hover:scale-105 sm:w-auto sm:px-6 sm:py-4"
				style="border-color: var(--accent);"
				onclick={triggerConfetti}
			>
				<span class="text-xl sm:text-2xl">📧</span>
				<div class="min-w-0 text-left">
					<p class="text-xs uppercase tracking-wider" style="color: var(--text-muted);">Email me</p>
					<p
						class="break-all font-mono text-xs transition-colors sm:text-sm"
						style="color: var(--accent);"
					>
						varundudeja95@gmail.com
					</p>
				</div>
			</a>
		</div>

		<div class="mt-8 flex flex-wrap items-center gap-3 sm:mt-12 sm:gap-4">
			<span class="font-mono text-xs sm:text-sm" style="color: var(--text-muted);">find_me_on:</span
			>
			<a
				href="https://github.com/vdud"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				class="flex items-center justify-center rounded-lg p-3 transition-all hover:scale-110"
				style="color: var(--text-muted);"
			>
				<Github size={20} />
			</a>
			<a
				href="https://www.linkedin.com/in/varun-dudeja-3ba254142/"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn"
				class="flex items-center justify-center rounded-lg p-3 transition-all hover:scale-110"
				style="color: var(--text-muted);"
			>
				<Linkedin size={20} />
			</a>
			<a
				href="https://twitter.com/varundudeja96"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Twitter"
				class="flex items-center justify-center rounded-lg p-3 transition-all hover:scale-110"
				style="color: var(--text-muted);"
			>
				<Twitter size={20} />
			</a>
		</div>
	</div>
</section>

<footer class="border-t px-4 py-6 sm:px-6 sm:py-8" style="border-color: var(--border-color);">
	<div
		class="mx-auto flex max-w-3xl flex-col items-center justify-between gap-2 font-mono text-xs sm:flex-row sm:gap-0"
		style="color: var(--text-muted);"
	>
		<p>© {new Date().getFullYear()} x_u</p>
	</div>
</footer>

<style>
	.social-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: var(--accent);
	}

	.content-card:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border-color: var(--accent);
	}
</style>
