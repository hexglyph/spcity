import Link from "next/link"
import Image from "next/image"

const TopMenu = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50" data-topmenu>
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Image src="/logo.png" alt="SPCity Logo" width={60} height={40} />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-800">SPCity</span>
                        <span className="text-sm text-gray-600">Acolhimento de Demandas do Cidadão de São Paulo</span>
                    </div>
                </div>
                <div className="space-x-4">
                    <Link href="/privacidade" className="text-sm text-gray-600 hover:text-gray-800">
                        Política de Privacidade
                    </Link>
                    <Link href="/termos" className="text-sm text-gray-600 hover:text-gray-800">
                        Termos de Serviço
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TopMenu

