import Link from 'next/link'

const FooterLinks = () => {
    return (
        <div className="bg-white rounded shadow p-2 text-sm">
            <Link href="/privacidade" className="text-blue-600 hover:text-blue-800 mr-4">
                Política de Privacidade
            </Link>
            <Link href="/termos" className="text-blue-600 hover:text-blue-800">
                Termos de Serviço
            </Link>
        </div>
    )
}

export default FooterLinks

