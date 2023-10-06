import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
    const tricodes = await prisma.team.findMany({select: {id: true, code: true}})
    //console.log(teams)
    return json(tricodes);
}