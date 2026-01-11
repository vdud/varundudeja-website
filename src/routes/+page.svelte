<script lang="ts">
    import { onMount } from "svelte";

    let cursorX = $state(0);
    let cursorY = $state(0);
    let showCursor = $state(false);
    let theme = $state<"light" | "dark" | "system">("system");
    let resolvedTheme = $state<"light" | "dark">("dark");

    onMount(() => {
        // Load saved theme or default to system
        const savedTheme = localStorage.getItem("theme") as
            | "light"
            | "dark"
            | "system"
            | null;
        theme = savedTheme || "system";
        updateTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", updateTheme);

        // Cursor effect
        const handleMouseMove = (e: MouseEvent) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            showCursor = true;
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            mediaQuery.removeEventListener("change", updateTheme);
        };
    });

    function updateTheme() {
        if (theme === "system") {
            resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
        } else {
            resolvedTheme = theme;
        }
        document.documentElement.setAttribute("data-theme", resolvedTheme);
        localStorage.setItem("theme", theme);
    }

    function cycleTheme() {
        const themes: ("light" | "dark" | "system")[] = [
            "system",
            "light",
            "dark",
        ];
        const currentIndex = themes.indexOf(theme);
        theme = themes[(currentIndex + 1) % themes.length];
        updateTheme();
    }

    const skillCategories = [
        {
            name: "Frontend",
            icon: "⚡",
            skills: [
                "Svelte",
                "SvelteKit",
                "TypeScript",
                "TailwindCSS",
                "Vercel",
            ],
        },
        {
            name: "Backend & Web3",
            icon: "🔗",
            skills: ["Supabase", "Python", "Solidity", "Web3.js", "MongoDB"],
        },
        {
            name: "Creative",
            icon: "🎨",
            skills: [
                "Photoshop",
                "Illustrator",
                "After Effects",
                "Blender",
                "Premiere Pro",
            ],
        },
    ];

    const emailSubject = encodeURIComponent("Let's work together!");
    const emailBody = encodeURIComponent(
        "Hi Varun,\n\nI came across your portfolio and would love to discuss a potential project.\n\nBest regards",
    );
</script>

<!-- Cursor glow effect -->
{#if showCursor}
    <div
        class="cursor-glow hidden md:block"
        style="left: {cursorX}px; top: {cursorY}px;"
    ></div>
{/if}

<!-- Navigation -->
<nav
    class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
    style="background-color: var(--nav-bg); border-color: var(--border-color);"
>
    <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" class="group flex items-center gap-1">
            <span class="text-2xl font-bold gradient-text">VD</span>
            <span
                class="text-2xl font-light group-hover:rotate-12 transition-transform"
                style="color: var(--accent);">.</span
            >
        </a>
        <div class="flex items-center gap-6">
            <a
                href="#about"
                class="link-underline text-sm transition-colors"
                style="color: var(--text-secondary);">~/about</a
            >
            <a
                href="#skills"
                class="link-underline text-sm transition-colors"
                style="color: var(--text-secondary);">~/skills</a
            >
            <a
                href="#contact"
                class="link-underline text-sm transition-colors"
                style="color: var(--text-secondary);">~/contact</a
            >

            <!-- Theme Toggle -->
            <button
                onclick={cycleTheme}
                class="theme-toggle p-2 rounded-lg transition-colors"
                style="color: var(--text-secondary);"
                aria-label="Toggle theme"
                title={theme === "system"
                    ? "System theme"
                    : theme === "light"
                      ? "Light mode"
                      : "Dark mode"}
            >
                {#if theme === "system"}
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                {:else if theme === "light"}
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                {:else}
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                {/if}
            </button>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<section
    class="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden"
>
    <!-- Background grid -->
    <div
        class="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"
    ></div>

    <div class="max-w-4xl relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Left: Text -->
            <div class="text-left">
                <p
                    class="font-mono text-sm mb-4 tracking-wider"
                    style="color: var(--accent);"
                >
                    // HELLO WORLD
                </p>
                <h1
                    class="text-5xl md:text-6xl font-bold mb-4 leading-tight"
                    style="color: var(--text-primary);"
                >
                    I'm <span class="gradient-text">Varun</span>
                </h1>
                <p
                    class="text-2xl md:text-3xl mb-6 glitch"
                    style="color: var(--text-secondary);"
                    data-text="Web Developer"
                >
                    Web Developer<span class="terminal-cursor"></span>
                </p>
                <p
                    class="text-lg mb-8 leading-relaxed"
                    style="color: var(--text-muted);"
                >
                    Full-stack developer & creative. Building with
                    <span style="color: var(--accent-secondary);">Svelte</span>,
                    <span style="color: var(--accent);">Web3</span>, and
                    <span class="text-pink-400">pixels</span>.
                </p>
                <div class="flex items-center gap-4">
                    <a
                        href="#contact"
                        class="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
                    >
                        Let's Talk →
                    </a>
                    <a
                        href="#skills"
                        class="px-6 py-3 border rounded-lg font-medium transition-all"
                        style="border-color: var(--border-color); color: var(--text-secondary);"
                    >
                        See Skills
                    </a>
                </div>
            </div>

            <!-- Right: Profile Image -->
            <div class="float flex justify-center">
                <div class="relative group">
                    <!-- Glow ring -->
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"
                    ></div>
                    <!-- Image container -->
                    <div
                        class="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-2"
                        style="border-color: var(--border-color);"
                    >
                        <img
                            src="/Dp.webp"
                            alt="Varun Dudeja"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <!-- Status badge -->
                    <div
                        class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 border rounded-full"
                        style="background-color: var(--bg-primary); border-color: var(--accent);"
                    >
                        <span class="flex items-center gap-2 text-xs font-mono">
                            <span
                                class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                            ></span>
                            <span style="color: var(--text-secondary);"
                                >Available</span
                            >
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="py-32 px-6 relative">
    <div class="max-w-3xl mx-auto">
        <p class="font-mono text-sm mb-2" style="color: var(--accent);">01.</p>
        <h2 class="text-3xl font-bold mb-8" style="color: var(--text-primary);">
            About <span style="color: var(--text-muted);">me</span>
        </h2>
        <div class="grid md:grid-cols-[2fr_1fr] gap-12">
            <div
                class="space-y-6 text-lg leading-relaxed"
                style="color: var(--text-secondary);"
            >
                <p>
                    I bridge the gap between <span
                        style="color: var(--text-primary);"
                        >code and creativity</span
                    >. From crafting sleek frontends with Svelte to diving into
                    Web3 smart contracts, I bring ideas to life across the
                    entire stack.
                </p>
                <p>
                    When I'm not coding, you'll find me pushing pixels in After
                    Effects or building 3D worlds in Blender. <span
                        style="color: var(--accent);"
                        >The best products happen when technical skill meets
                        artistic vision.</span
                    >
                </p>
            </div>
            <div class="space-y-4">
                <div class="code-block rounded-lg p-4 font-mono text-xs">
                    <p style="color: var(--text-muted);">// Quick stats</p>
                    <p style="color: var(--text-secondary);" class="mt-2">
                        stack: <span style="color: var(--accent);">full</span>
                    </p>
                    <p style="color: var(--text-secondary);">
                        creative: <span style="color: var(--accent-secondary);"
                            >true</span
                        >
                    </p>
                    <p style="color: var(--text-secondary);">
                        web3: <span class="text-green-400">enabled</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Skills Section -->
<section
    id="skills"
    class="py-32 px-6"
    style="background-color: var(--bg-tertiary);"
>
    <div class="max-w-4xl mx-auto">
        <p class="font-mono text-sm mb-2" style="color: var(--accent);">02.</p>
        <h2
            class="text-3xl font-bold mb-12"
            style="color: var(--text-primary);"
        >
            Tools I <span style="color: var(--text-muted);">wield</span>
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
            {#each skillCategories as category}
                <div class="group">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-xl">{category.icon}</span>
                        <h3
                            class="text-lg font-semibold"
                            style="color: var(--text-primary);"
                        >
                            {category.name}
                        </h3>
                    </div>
                    <div class="space-y-2">
                        {#each category.skills as skill}
                            <div
                                class="skill-card px-4 py-3 rounded-lg border flex items-center justify-between"
                            >
                                <span
                                    class="text-sm"
                                    style="color: var(--text-secondary);"
                                    >{skill}</span
                                >
                                <span
                                    class="text-xs font-mono"
                                    style="color: var(--accent);">✓</span
                                >
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>

        <p
            class="text-sm mt-12 font-mono text-center"
            style="color: var(--text-muted);"
        >
            // 15 tools. Infinite possibilities.
        </p>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-32 px-6">
    <div class="max-w-3xl mx-auto">
        <p class="font-mono text-sm mb-2" style="color: var(--accent);">03.</p>
        <h2 class="text-3xl font-bold mb-6" style="color: var(--text-primary);">
            Let's <span class="gradient-text">connect</span>
        </h2>
        <p class="text-lg mb-10 max-w-xl" style="color: var(--text-secondary);">
            Got a project that needs that extra something? Whether it's a web
            app, smart contract, or creative work—let's build something amazing.
        </p>

        <div class="flex flex-wrap items-center gap-6">
            <a
                href="mailto:varundudeja95@gmail.com?subject={emailSubject}&body={emailBody}"
                class="group inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border rounded-xl transition-all hover:scale-105"
                style="border-color: var(--accent);"
            >
                <span class="text-2xl">📧</span>
                <div class="text-left">
                    <p
                        class="text-xs uppercase tracking-wider"
                        style="color: var(--text-muted);"
                    >
                        Email me
                    </p>
                    <p
                        class="font-mono text-sm transition-colors"
                        style="color: var(--accent);"
                    >
                        varundudeja95@gmail.com
                    </p>
                </div>
            </a>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-4 mt-12">
            <span class="text-sm font-mono" style="color: var(--text-muted);"
                >find_me_on:</span
            >
            <a
                href="https://github.com/vdud"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                class="p-3 rounded-lg transition-all hover:scale-110"
                style="color: var(--text-muted);"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                    ><path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    /></svg
                >
            </a>
            <a
                href="https://www.linkedin.com/in/varun-dudeja-3ba254142/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                class="p-3 rounded-lg transition-all hover:scale-110"
                style="color: var(--text-muted);"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                    ><path
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    /></svg
                >
            </a>
            <a
                href="https://twitter.com/varundudeja96"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                class="p-3 rounded-lg transition-all hover:scale-110"
                style="color: var(--text-muted);"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                    ><path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    /></svg
                >
            </a>
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="py-8 px-6 border-t" style="border-color: var(--border-color);">
    <div
        class="max-w-3xl mx-auto flex items-center justify-between text-xs font-mono"
        style="color: var(--text-muted);"
    >
        <p>© {new Date().getFullYear()} varun.dev</p>
        <p>Built with Svelte + ☕</p>
    </div>
</footer>
