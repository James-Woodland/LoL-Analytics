<script>
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownWrapper, SidebarDropdownItem } from 'flowbite-svelte';
	import "../app.css";
</script>

<div class="flex flex-column w-1/6 h-full overflow-hidden">
	<aside class="absolute w-1/6 h-full flex">
		<div class="w-full h-full bg-slate-950 flex flex-col">	
			<div class="sidebar-header outline-slate-800 flex">
				<img src="/TeamIcons/DSYRE.webp" alt="DSYRE Logo" class="max-w-full max-h-full">
			</div>
			<div class="sidebar-main text outline-slate-800 overflow-auto">
				<Sidebar asideClass = "w-full">
					<SidebarWrapper>
					  <SidebarGroup>
						<SidebarItem label="Dashboard" href="/" aClass = "flex items-center p-2 text-base text-2xl font-bold text-red-700 rounded-lg hover:bg-gray-100" activeClass = 'flex items-center p-2 text-2xl font-bold text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-100'/>
						<SidebarItem label="Scrims" href="" aClass = "flex items-center p-2 text-base text-2xl font-bold text-red-700 rounded-lg hover:bg-gray-100" activeClass = 'flex items-center p-2 text-2xl font-bold text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-100'/>
						<SidebarItem label="Officials" href="" aClass = "flex items-center p-2 text-base text-2xl font-bold text-red-700 rounded-lg hover:bg-gray-100" activeClass = 'flex items-center p-2 text-2xl font-bold text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-100'/>
						<SidebarDropdownWrapper label="Scouting" btnClass = "flex items-center p-2 w-full text-base font-bold text-2xl text-red-700 rounded-lg transition duration-75 group hover:bg-gray-100 ">
							<SidebarDropdownWrapper label="PG Nats" btnClass = "flex items-center p-2 w-full text-base font-bold text-xl text-red-700 rounded-lg transition duration-75 group hover:bg-gray-100 ">
								<SidebarItem label="aNc Outplayed" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100 "/>
								<SidebarItem label="Atleta Esports" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100 "/>
								<SidebarItem label="Axolotl Esports" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100 "/>
								<SidebarItem label="Cyberground Gaming" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100 "/>
								<SidebarItem label="Dren Esports" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100 "/>
								<SidebarItem label="DSYRE" href='/scouting/team' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg hover:bg-gray-100 "/>
								<SidebarItem label="ENEMI3S" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100"/>
								<SidebarItem label="Macko Esports" href='' aClass = "flex items-center p-2 text-base text-lg font-bold  text-red-700 rounded-lg  hover:bg-gray-100"/>
							</SidebarDropdownWrapper>
						</SidebarDropdownWrapper>
					  </SidebarGroup>
					</SidebarWrapper>
				  </Sidebar>
			</div>
			<div class="sidebar-footer outline-slate-800 justify-center">
				<a href="https://twitter.com/ThatStatGuyZero" class="text-red-700 font-bold text-lg">Created By Zero</a>
			</div>
		</div>
	</aside>
</div>

<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
</svelte:head>
	
<style>
	:global(body) {
		padding: 0;
		height: 100vh;
	}	

	.sidebar-header{
		width: 100%;
		height: 15%;
		outline-width: 2px;
		outline-style: solid;
		display: flex;
		align-items: center;
	}

	.sidebar-main{
		width: 100%;
		height: 80%;
		outline-width: 2px;
		outline-style: solid;
	}

	.text {
		color: rgb(218, 0, 55);
	}

	.sidebar-footer{
		width: 100%;
		height: 5%;
		outline-width: 2px;
		outline-style: solid;
		display: flex;
		align-items: center;
	}

	img{
		margin: auto;
	}

	
</style>
