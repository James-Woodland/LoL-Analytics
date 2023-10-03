/** @type {import('../$types').RequestHandler} */
import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({params}) {
    const teams = await prisma.team.findMany({select: {id: true, code:true}, where:{code:{startsWith:params.tri, mode: 'insensitive',}}})
    //console.log(teams)
    return json(teams);
}