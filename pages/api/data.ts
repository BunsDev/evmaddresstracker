// pages/api/data.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Address } from 'viem';
import { useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { Address as AddressType, getAddress, isAddress } from "viem";

// Define types for your data
interface Data {
    address: Address;
    ens: string;
    balance: number;
}

    //create a function to get the balance of an address
    const getAddressBalance = async (address: string) => {
        if (address) {
            return '0';
        }
        const balance = useBalance({address:address as Address, chainId: 1});
        return balance;
    };

    //create a function to get the balance of an address
    const getAddressEns = async (address: string) => {
            if (address) {
                    return '0';
            }
            const { data: fetchedEns } = useEnsName({
                    address: address as Address,
                    chainId: 1,
                });
                const { data: fetchedEnsAvatar } = useEnsAvatar({
                    name: fetchedEns as string,
                    chainId: 1,
                });
            // const { data: ensName } = useEnsName({
            //     address: address as Address,
            //   });
            //   const { data: ensAvatar } = useEnsAvatar({
            //     name: ensName as string,
            //   });
            return fetchedEnsAvatar;
    };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('req.body', req.body);

    try {
        // Fetch data from an external API
        const addresses: string[] = req.body.addresses;
        const dataList: Promise<Data>[] = addresses.map(async (address: string) => { 
            const balance = await getAddressBalance(address);
            const ens = await getAddressEns(address);
            console.log('current balance', balance  as unknown as number);
            const data: Data = {
                address: address as Address,
                ens: ens as string,
                balance: balance as unknown as number,
            };
            console.log('data', data);
            return data;
        });

        const results = await Promise.all(dataList);
        
        // Return the data after fetching it
        res.status(200).json(results);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
      }
}
  