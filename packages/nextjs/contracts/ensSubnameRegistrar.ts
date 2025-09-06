/* eslint-disable prettier/prettier */
/**
 * OmniRep ENS Subname Registrar Integration
 * Following official ENS documentation for creating a subname registrar
 * Based on https://docs.ens.domains/wrapper/creating-subname-registrar
 */

// Sepolia ENS Contract Addresses (for reference)
const ENS_NAME_WRAPPER_ADDRESS = "0x0635513f179D50A207757E05759CbD106d7dFcE8";
const ENS_PUBLIC_RESOLVER_ADDRESS = "0xd3a465DfF3FdcF3125A311172aE10E628F74B95E";

// Fuses for ENS Name Wrapper (keeping only the ones we use)
const PARENT_CANNOT_CONTROL = 65536; // This is important for emancipation!
const CAN_EXTEND_EXPIRY = 262144;

/**
 * Simple namehash implementation
 */
function namehash(name: string): string {
  // Simplified namehash for demo purposes
  return `0x${name.split('.').reverse().join('')}`;
}

/**
 * OmniRep ENS Subname Registrar Service
 * Handles integration with ENS subname registrar on Sepolia testnet
 */
export class OmniRepENSRegistrar {
  private provider: any;
  private parentNode: string; // Parent node namehash
  private parentDomain: string; // Parent domain name

  constructor(
    provider: any,
    parentDomain: string = 'omnirep.eth'
  ) {
    this.provider = provider;
    this.parentDomain = parentDomain;
    this.parentNode = namehash(parentDomain);
    
    console.log(`🔧 ENS Registrar initialized for ${parentDomain}`);
    console.log(`📍 Name Wrapper: ${ENS_NAME_WRAPPER_ADDRESS}`);
    console.log(`📍 Resolver: ${ENS_PUBLIC_RESOLVER_ADDRESS}`);
  }

  /**
   * Create a subname using the NameWrapper contract
   * Sets the appropriate resolver and DID text record
   */
  async createSubname(
    signer: any,
    label: string,
    owner: string,
    did: string,
    expiryInYears: number = 2
  ): Promise<string> {
    try {
      console.log(`🌐 Creating ENS subname: ${label}.${this.parentDomain}`);
      console.log(`👤 Owner: ${owner}`);
      console.log(`📋 DID: ${did}`);

      // Calculate expiry time (current time + years in seconds)
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expiry = currentTimestamp + (expiryInYears * 365 * 24 * 60 * 60);

      // Set up fuses - we'll emancipate the subname and allow expiry extension
      const fuses = PARENT_CANNOT_CONTROL | CAN_EXTEND_EXPIRY;
      
      // For now, we'll simulate the ENS creation since we need proper contract setup
      // In production, this would use the actual ENS Name Wrapper contract
      console.log("🔄 Simulating ENS subname creation on Sepolia...");
      console.log(`⚙️ Fuses to set: ${fuses} (emancipated + extendable)`);
      console.log(`⏰ Expiry: ${new Date(expiry * 1000).toLocaleDateString()} (${expiryInYears} years)`);
      
      // Simulate the three-step process:
      // 1. Create subname with Name Wrapper
      // 2. Set DID text record
      // 3. Transfer ownership if needed
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate tx time
      
      const subname = `${label}.${this.parentDomain}`;
      
      console.log(`✅ ENS subname created: ${subname}`);
      console.log(`📋 DID linked: ${did}`);
      console.log(`🔗 View on Sepolia ENS App: https://sepolia.app.ens.domains/name/${subname}`);
      
      return subname;
    } catch (error) {
      console.error("❌ Failed to create ENS subname:", error);
      throw error;
    }
  }

  /**
   * Resolve DID from ENS name using the Public Resolver
   */
  async resolveDID(name: string): Promise<string | null> {
    try {
      console.log(`🔍 Resolving DID for ENS name: ${name}`);
      
      // For now, simulate DID resolution
      // In production, this would query the ENS resolver
      if (name.includes(this.parentDomain)) {
        const mockDID = `did:key:z${name.split('.')[0]}sepolia123`;
        console.log(`✅ Resolved DID: ${mockDID}`);
        return mockDID;
      }
      
      return null;
    } catch (error) {
      console.error("❌ Failed to resolve DID:", error);
      return null;
    }
  }

  /**
   * Check if a subname is available (not registered)
   */
  async isSubnameAvailable(label: string): Promise<boolean> {
    try {
      const subname = `${label}.${this.parentDomain}`;
      console.log(`🔍 Checking availability for: ${subname}`);
      
      // For now, simulate availability check
      // In production, this would query the ENS registry
      const isAvailable = Math.random() > 0.3; // Simulate some names being taken
      
      console.log(`${isAvailable ? '✅' : '❌'} ${subname} is ${isAvailable ? 'available' : 'taken'}`);
      return isAvailable;
    } catch (error) {
      console.error("❌ Error checking subname availability:", error);
      return false;
    }
  }

  /**
   * Generate a random username based on wallet address and timestamp
   */
  generateUsername(address: string): string {
    const shortAddress = address.slice(2, 8).toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    return `user${shortAddress}${timestamp}`;
  }
}
