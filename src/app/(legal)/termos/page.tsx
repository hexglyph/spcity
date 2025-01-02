export default function TermsOfService() {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Terms of Service</h1>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">June 1, 2023</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Acceptance of terms</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            By accessing and using SPCity, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using SPCity particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Description of service</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            SPCity provides users with access to a rich collection of resources, including various communications tools, forums, and personalized content. You understand and agree that the service may include advertisements and that these advertisements are necessary for SPCity to provide the service.
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">User conduct</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            You agree to not use the Service to:
                            <ul className="list-disc pl-5 mt-2">
                                <li>Upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
                                <li>Impersonate any person or entity, including, but not limited to, a SPCity official, forum leader, guide or host, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
                                <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Service;</li>
                            </ul>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Modifications to service</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            SPCity reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that SPCity shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Contact</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            If you have any questions about these Terms, please contact us at:
                            <br /><br />
                            SPCity<br />
                            123 Terms Street<br />
                            São Paulo, SP 01000-000<br />
                            Brazil<br />
                            Email: terms@spcity.com
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

