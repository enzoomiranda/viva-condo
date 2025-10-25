"use client";

import { useEffect, useState } from "react";
import { getCondominios, ICondominio } from "@/services/api-condominios";
import { useRouter } from "next/navigation";
import { FaSearch } from 'react-icons/fa';

export default function ListaCondominios() {

    const [condominios, setCondominios] = useState<ICondominio[]>([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState<Error>()
    const [search, setSearch] = useState("")
    const router = useRouter()

    useEffect(() => {

        const buscarCondominios = async () => {
            try {
                const response = await getCondominios()
                console.log("data" + response)
                setCondominios(response.data)
            } catch (error: any) {
                console.log("Erro" + error)
                setErr(error)
            } finally {
                setLoading(false)
            }
        }

        buscarCondominios()
    }, [])

    useEffect(() => {
        if (!loading) {
            try {
                const needs = sessionStorage.getItem("needsRefresh")
                if (needs) {
                    router.refresh()
                    sessionStorage.removeItem("needsRefresh")
                }
            } catch (e) {
                // silencia falhas com sessionStorage
            }
        }
    }, [loading, router])

    const filteredCondominios = condominios.filter((c) => {
        if (!search) return true
        const q = search.toLowerCase().trim()
        return (
            String(c.nome_condominio ?? "").toLowerCase().includes(q) ||
            String(c.endereco_condominio ?? "").toLowerCase().includes(q) ||
            String(c.cidade_condominio ?? "").toLowerCase().includes(q) ||
            String(c.uf_condominio ?? "").toLowerCase().includes(q) ||
            String(c.tipo_condominio ?? "").toLowerCase().includes(q) ||
            String(c.id_condominio ?? "").toLowerCase().includes(q)
        )
    })

    return (
        <div className="p-6 max-w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-x1 font-semibold">Condomínios</h1>
            </div>
            <div className="relative w-full max-w-md mb-4">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <FaSearch className="w-4 h-4"/>
                </span>
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Nome</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Endereço</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking wider">Cidade</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking wider">UF</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking wider">Tipo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {err ? (
                            <tr>
                                <td className="px-4 py-3 text-sm text-red-700" colSpan={7}>
                                    Erro encontrado: {err.message}
                                </td>
                            </tr>) : loading ? (
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-700" colSpan={7}>
                                        Carregando...
                                    </td>
                                </tr>) : filteredCondominios.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-gray-700" colSpan={7}>
                                            Nenhum condomínio encontrado.
                                        </td>
                                    </tr>
                                ) : (
                            filteredCondominios.map((condominio, index) => (
                                <tr key={condominio.id_condominio} className="hover.bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{String(index + 1)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{condominio.nome_condominio}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{condominio.endereco_condominio}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{condominio.cidade_condominio}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{condominio.uf_condominio}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{condominio.tipo_condominio}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}