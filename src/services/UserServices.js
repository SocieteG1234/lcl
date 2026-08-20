// services/UserServices.js

// ============================================
// MODE DÉVELOPPEMENT
// ============================================
const DEV_MODE = true;

const STORAGE_KEY   = 'lcl_users_data';
const VERSION_KEY   = 'lcl_data_version';
const DATA_VERSION  = 6; // ⚡ INCRÉMENTER CE NUMÉRO À CHAQUE MODIFICATION DES UTILISATEURS

// ============================================
// DONNÉES DE BASE DES UTILISATEURS
// ============================================
// ➕ Pour ajouter un utilisateur :
//    1. Copier un bloc et l'ajouter au tableau
//    2. Changer l'id (unique), username, password...
//    3. Incrémenter DATA_VERSION ci-dessus
// ============================================
const BASE_USERS = [

  // ── Utilisateur 1 ────────────────────────────────────────────
  {
    id: 1,
    username: '07014860451',
    password: '260823',
    name: 'Leticia Durand',
    email: 'leticia.durand@gmail.com',
    phone: '+33 07 74 52 52 87',
    accountNumber: '20250000001',
    country: 'France',
    city: 'Brest',
    location: 'Brest, France',
    manager: 'Lucien Vollet',
    balance: 8000000.00,

    isBlocked: false,
    unlockFee: null,
    blockReason: null,

    // Virements autorisés
    transferBlocked: false,
    transferBlockReason: null,
    transferUnlockFee: 0,

    rib: {
      iban: 'FR76 3000 5000 0102 0123 4567 880',
      bankCode: '30004',
      branchCode: '00001',
      accountNumber: '00123456789',
      key: '80',
    },

    cards: [
      {
        id: 1,
        type: 'Visa Premier',
        cardNumber: '4532 0001 7892 2345',
        maskedNumber: '4532 **** **** 2345',
        cvv: '123',
        expiryDate: '10/27',
        status: 'active',
        dailyWithdrawalLimit: 500,
        weeklyPaymentLimit: 2000,
        internationalPaymentEnabled: true,
        issueDate: '12/2022',
        cardHolder: 'LETTICE DURAND',
      },
    ],

    accounts: [
      {
        id: 1,
        type: 'Compte Courant',
        number: 'N°*******2284',
        balance: 8000000.00,
        icon: 'wallet'
      },
      {
        id: 2,
        type: 'Livret A',
        number: 'N°*******5462',
        balance: 30000.40,
        icon: 'piggybank'
      },
      {
        id: 3,
        type: 'Plan Épargne',
        number: 'N°*******8891',
        balance: 50000.17,
        icon: 'trending'
      },
    ],

    transactions: [
      {
        id: 1,
        type: 'Virement entrant',
        date: '14 Déc 2017',
        reference: 'IE28 *** 513',
        amount: 40000.00,
        isCredit: true
      },
      {
        id: 2,
        type: 'Achat carte',
        date: '14 Déc 2017',
        reference: 'CARREFOUR BREST',
        amount: 85.50,
        isCredit: false
      },
      {
        id: 3,
        type: 'Virement sortant',
        date: '13 Déc 2017',
        reference: 'FR76 *** 657',
        amount: 1200.00,
        isCredit: false
      },
      {
        id: 4,
        type: 'Virement entrant',
        date: '12 Déc 2017',
        reference: 'US45 *** 234',
        amount: 3000.00,
        isCredit: true
      },
      {
        id: 5,
        type: 'Achat carte',
        date: '11 Déc 2017',
        reference: 'UBER PARIS',
        amount: 45.20,
        isCredit: false
      },
      {
        id: 6,
        type: 'Retrait ATM',
        date: '10 Déc 2017',
        reference: 'ATM BNP PARIS 15',
        amount: 100.00,
        isCredit: false
      },
      {
        id: 7,
        type: 'Virement entrant',
        date: '08 Déc 2017',
        reference: 'FR45 *** 891',
        amount: 500.00,
        isCredit: true
      },
      {
        id: 8,
        type: 'Achat carte',
        date: '07 Déc 2017',
        reference: 'FNAC PARIS',
        amount: 156.80,
        isCredit: false
      },
      {
        id: 9,
        type: 'Retrait ATM',
        date: '05 Déc 2017',
        reference: 'ATM BNP GARE LYON',
        amount: 200.00,
        isCredit: false
      },
      {
        id: 10,
        type: 'Achat carte',
        date: '03 Déc 2017',
        reference: 'AMAZON FRANCE',
        amount: 67.99,
        isCredit: false
      },
    ],

    expenses: {
      month: 'Décembre 2017',
      categories: [
        {
          name: 'Logement',
          value: 45,
          color: '#3B82F6'
        },
        {
          name: 'Alimentation',
          value: 25,
          color: '#10B981'
        },
        {
          name: 'Transport',
          value: 10,
          color: '#F97316'
        },
        {
          name: 'Loisirs',
          value: 12,
          color: '#6366F1'
        },
        {
          name: 'Autres',
          value: 8,
          color: '#D1D5DB'
        },
      ],
    },

    chequier: 5,
    virementRapide: 10,
    virementProgramme: 3,
  },


  // ── Utilisateur 2 : André Durant ─────────────────────────────
  {
    id: 2,

    username: '07014860452',
    password: '260824',

    name: 'André Durant',

    email: 'andre.durant@gmail.com',
    phone: '+33 07 74 52 52 88',

    accountNumber: '20250000002',

    country: 'France',
    city: '',
    location: 'France',

    manager: 'Charles Fortunato',

    // Somme du compte
    balance: 76505.00,

    // ==========================================================
    // COMPTE ACTIF
    // ==========================================================
    isBlocked: false,
    unlockFee: null,
    blockReason: 'votre compte est actuellement bloqué pour des raisons de sécurité,veuillez vous acquiter de la somme de 13775.00£ pour débloquer votre compte et effectuer vos virements.',

    // ==========================================================
    // UNIQUEMENT LES VIREMENTS SONT BLOQUÉS
    // ==========================================================
    transferBlocked: true,
    transferBlockReason:
      'Les virements sont temporairement indisponibles.',
    transferUnlockFee: 13775.00,

    rib: {
      iban: '',
      bankCode: '',
      branchCode: '',
      accountNumber: '',
      key: '',
    },

    cards: [],

    accounts: [
      {
        id: 1,
        type: 'Compte Courant',
        number: 'N°*******0002',
        balance: 76505.00,
        icon: 'wallet'
      }
    ],

    transactions: [],

    expenses: {
      month: new Date().toLocaleDateString(
        'fr-FR',
        {
          month: 'long',
          year: 'numeric'
        }
      ),

      categories: [
        {
          name: 'Logement',
          value: 0,
          color: '#3B82F6'
        },
        {
          name: 'Alimentation',
          value: 0,
          color: '#10B981'
        },
        {
          name: 'Transport',
          value: 0,
          color: '#F97316'
        },
        {
          name: 'Loisirs',
          value: 0,
          color: '#6366F1'
        },
        {
          name: 'Autres',
          value: 0,
          color: '#D1D5DB'
        },
      ],
    },

    chequier: 0,
    virementRapide: 0,
    virementProgramme: 0,
  },

];


// ===================================================================
// USER SERVICE
// ===================================================================

class UserService {

  constructor() {
    if (DEV_MODE) {
      console.log(
        '🔧 UserService initialisé — version données:',
        DATA_VERSION
      );
    }

    this._initStorage();
  }


  // ================================================================
  // INITIALISATION LOCALSTORAGE
  // ================================================================

  _initStorage() {

    const storedVersion =
      localStorage.getItem(VERSION_KEY);

    // Si la version a changé ou première utilisation,
    // on recharge BASE_USERS
    if (
      storedVersion !== String(DATA_VERSION)
    ) {

      if (DEV_MODE) {
        console.log(
          `🔄 Version changée (${storedVersion} → ${DATA_VERSION}) — reset des données`
        );
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(BASE_USERS)
      );

      localStorage.setItem(
        VERSION_KEY,
        String(DATA_VERSION)
      );

      this.users =
        JSON.parse(
          JSON.stringify(BASE_USERS)
        );

    } else {

      const stored =
        localStorage.getItem(STORAGE_KEY);

      this.users =
        stored
          ? JSON.parse(stored)
          : JSON.parse(
              JSON.stringify(BASE_USERS)
            );

      if (DEV_MODE) {
        console.log(
          `✅ Données chargées depuis localStorage (v${DATA_VERSION}) — ${this.users.length} utilisateurs`
        );
      }
    }
  }


  // ================================================================
  // SAUVEGARDE
  // ================================================================

  _save() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.users)
    );

    if (DEV_MODE) {
      console.log(
        '💾 Données sauvegardées dans localStorage'
      );
    }
  }


  // ================================================================
  // GÉNÉRER IBAN
  // ================================================================

  generateIBAN(userId) {

    const countryCode =
      'FR';

    const checkDigits =
      String(
        Math.floor(Math.random() * 90) + 10
      );

    const bankCode =
      '30004';

    const branchCode =
      String(10000 + userId)
        .padStart(5, '0');

    const accountNumber =
      String(
        Math.floor(
          Math.random() * 100000000000
        )
      ).padStart(11, '0');

    const key =
      String(
        Math.floor(Math.random() * 90) + 10
      );

    const iban =
      `${countryCode}${checkDigits} ${bankCode} ${branchCode} ${accountNumber} ${key}`;

    if (DEV_MODE) {
      console.log(
        '📋 IBAN généré:',
        iban
      );
    }

    return {
      iban,
      bankCode,
      branchCode,
      accountNumber,
      key
    };
  }


  // ================================================================
  // GÉNÉRER NUMÉRO CARTE
  // ================================================================

  generateCardNumber(userId, cardId) {

    const randomPart =
      Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, '0');

    const lastFour =
      String(
        1234 + userId + cardId
      ).padStart(4, '0');

    const cardNumber =
      `4532 ${String(userId).padStart(4, '0')} ${randomPart} ${lastFour}`;

    if (DEV_MODE) {
      console.log(
        '💳 Carte générée:',
        cardNumber
      );
    }

    return cardNumber;
  }


  // ================================================================
  // GESTIONNAIRE ALÉATOIRE
  // ================================================================

  assignRandomManager() {

    const managers = [
      'Charles Fortunato',
      'Sophie Martin',
      'Pierre Dubois',
      'Marie Lefebvre',
      'Thomas Bernard',
      'Claire Rousseau'
    ];

    return managers[
      Math.floor(
        Math.random() * managers.length
      )
    ];
  }


  // ================================================================
  // AUTHENTIFICATION
  // ================================================================

  async authenticate(username, password) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        if (DEV_MODE) {
          console.log(
            '🔐 Tentative connexion:',
            username
          );
        }

        if (!username || !password) {
          reject(
            new Error(
              'Identifiant et mot de passe requis'
            )
          );
          return;
        }

        if (!/^\d{11}$/.test(username)) {
          reject(
            new Error(
              "L'identifiant doit contenir exactement 11 chiffres"
            )
          );
          return;
        }

        if (!/^\d+$/.test(password)) {
          reject(
            new Error(
              'Le mot de passe doit contenir uniquement des chiffres'
            )
          );
          return;
        }

        const user =
          this.users.find(
            u =>
              u.username === username &&
              u.password === password
          );

        if (user) {

          if (DEV_MODE) {
            console.log(
              '✅ Connexion réussie:',
              user.name
            );
          }

          const {
            password: _pwd,
            ...userWithoutPassword
          } = user;

          resolve(
            userWithoutPassword
          );

        } else {

          if (DEV_MODE) {
            console.error(
              '❌ Identifiants incorrects'
            );
          }

          reject(
            new Error(
              'Identifiant ou mot de passe incorrect'
            )
          );
        }

      }, 1000);
    });
  }


  // ================================================================
  // RÉCUPÉRER UTILISATEUR
  // ================================================================

  async getUserById(userId) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (user) {

          const {
            password: _pwd,
            ...userWithoutPassword
          } = user;

          resolve(
            userWithoutPassword
          );

        } else {

          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
        }

      }, 500);
    });
  }


  // ================================================================
  // VÉRIFIER SI LE VIREMENT EST AUTORISÉ
  // ================================================================

  async canMakeTransfer(userId) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {

          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );

          return;
        }

        // Compte complètement bloqué
        if (user.isBlocked === true) {

          reject(
            new Error(
              'Le compte est actuellement bloqué.'
            )
          );

          return;
        }

        // Compte actif mais virements bloqués
        if (user.transferBlocked === true) {

          reject(
            new Error(
              user.transferBlockReason ||
              'Les virements sont temporairement indisponibles.'
            )
          );

          return;
        }

        resolve(true);

      }, 300);
    });
  }


  // ================================================================
  // RÉCUPÉRER CARTES
  // ================================================================

  async getUserCards(userId) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (user) {

          resolve(
            user.cards || []
          );

        } else {

          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
        }

      }, 500);
    });
  }


  // ================================================================
  // ACTIVER / BLOQUER CARTE
  // ================================================================

  async toggleCardStatus(
    userId,
    cardId
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {
          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
          return;
        }

        const card =
          user.cards.find(
            c => c.id === cardId
          );

        if (!card) {
          reject(
            new Error(
              'Carte non trouvée'
            )
          );
          return;
        }

        card.status =
          card.status === 'active'
            ? 'blocked'
            : 'active';

        this._save();

        if (DEV_MODE) {
          console.log(
            '✅ Nouveau statut carte:',
            card.status
          );
        }

        resolve(card);

      }, 1000);
    });
  }


  // ================================================================
  // LIMITES CARTE
  // ================================================================

  async updateCardLimits(
    userId,
    cardId,
    limits
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {
          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
          return;
        }

        const card =
          user.cards.find(
            c => c.id === cardId
          );

        if (!card) {
          reject(
            new Error(
              'Carte non trouvée'
            )
          );
          return;
        }

        if (
          limits.dailyWithdrawalLimit !==
          undefined
        ) {
          card.dailyWithdrawalLimit =
            limits.dailyWithdrawalLimit;
        }

        if (
          limits.weeklyPaymentLimit !==
          undefined
        ) {
          card.weeklyPaymentLimit =
            limits.weeklyPaymentLimit;
        }

        this._save();

        resolve(card);

      }, 500);
    });
  }


  // ================================================================
  // PAIEMENT INTERNATIONAL
  // ================================================================

  async toggleInternationalPayment(
    userId,
    cardId
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {
          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
          return;
        }

        const card =
          user.cards.find(
            c => c.id === cardId
          );

        if (!card) {
          reject(
            new Error(
              'Carte non trouvée'
            )
          );
          return;
        }

        card.internationalPaymentEnabled =
          !card.internationalPaymentEnabled;

        this._save();

        resolve(card);

      }, 500);
    });
  }


  // ================================================================
  // NOUVELLE CARTE
  // ================================================================

  async orderNewCard(
    userId,
    cardType = 'Visa Premier'
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {
          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
          return;
        }

        const newCardId =
          user.cards.length + 1;

        const cardNumber =
          this.generateCardNumber(
            userId,
            newCardId
          );

        const lastFour =
          cardNumber.slice(-4);

        const newCard = {
          id: newCardId,
          type: cardType,
          cardNumber,
          maskedNumber:
            `4532 **** **** ${lastFour}`,
          cvv:
            Math.floor(
              100 + Math.random() * 900
            ).toString(),
          expiryDate: '12/29',
          status: 'active',
          dailyWithdrawalLimit: 500,
          weeklyPaymentLimit: 2000,
          internationalPaymentEnabled: false,
          issueDate:
            new Date().toLocaleDateString(
              'fr-FR',
              {
                month: '2-digit',
                year: 'numeric'
              }
            ),
          cardHolder:
            user.name.toUpperCase(),
        };

        user.cards.push(newCard);

        this._save();

        if (DEV_MODE) {
          console.log(
            '✅ Carte créée:',
            newCard
          );
        }

        resolve(newCard);

      }, 2000);
    });
  }


  // ================================================================
  // DÉBLOQUER LE COMPTE
  // ================================================================

  async unlockAccount(userId) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        if (DEV_MODE) {
          console.log(
            '🔓 Déblocage compte:',
            userId
          );
        }

        const userIndex =
          this.users.findIndex(
            u => u.id === userId
          );

        if (userIndex !== -1) {

          this.users[userIndex].isBlocked =
            false;

          this.users[userIndex].unlockFee =
            0;

          this.users[userIndex].blockReason =
            null;

          this._save();

          if (DEV_MODE) {
            console.log(
              '✅ Compte débloqué'
            );
          }

          const {
            password: _pwd,
            ...userWithoutPassword
          } = this.users[userIndex];

          resolve(
            userWithoutPassword
          );

        } else {

          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
        }

      }, 1000);
    });
  }


  // ================================================================
  // MODIFIER UTILISATEUR
  // ================================================================

  async updateUser(
    userId,
    updates
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const userIndex =
          this.users.findIndex(
            u => u.id === userId
          );

        if (userIndex !== -1) {

          this.users[userIndex] = {
            ...this.users[userIndex],
            ...updates
          };

          this._save();

          if (DEV_MODE) {
            console.log(
              '✅ Profil mis à jour'
            );
          }

          const {
            password: _pwd,
            ...userWithoutPassword
          } = this.users[userIndex];

          resolve(
            userWithoutPassword
          );

        } else {

          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
        }

      }, 500);
    });
  }


  // ================================================================
  // CRÉER UTILISATEUR
  // ================================================================

  async createUser(userData) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        if (DEV_MODE) {
          console.log(
            '🆕 Création utilisateur:',
            userData.username
          );
        }

        if (
          !/^\d{11}$/.test(
            userData.username
          )
        ) {
          reject(
            new Error(
              "L'identifiant doit contenir exactement 11 chiffres"
            )
          );
          return;
        }

        if (
          !/^\d+$/.test(
            userData.password
          )
        ) {
          reject(
            new Error(
              'Le mot de passe doit contenir uniquement des chiffres'
            )
          );
          return;
        }

        if (
          userData.password.length < 6
        ) {
          reject(
            new Error(
              'Le mot de passe doit contenir au moins 6 chiffres'
            )
          );
          return;
        }

        const existingUser =
          this.users.find(
            u =>
              u.username ===
                userData.username ||
              u.email ===
                userData.email
          );

        if (existingUser) {
          reject(
            new Error(
              'Un utilisateur avec cet identifiant ou email existe déjà'
            )
          );
          return;
        }

        const newUserId =
          Math.max(
            ...this.users.map(
              u => u.id
            )
          ) + 1;

        const accountNumber =
          `2025${String(newUserId).padStart(7, '0')}`;

        const rib =
          this.generateIBAN(
            newUserId
          );

        const cardNumber =
          this.generateCardNumber(
            newUserId,
            1
          );

        const lastFour =
          cardNumber.slice(-4);

        const newUser = {

          id: newUserId,

          username:
            userData.username,

          password:
            userData.password,

          name:
            userData.name,

          email:
            userData.email,

          phone:
            userData.phone || '',

          country:
            userData.country || '',

          city:
            userData.city || '',

          location:
            userData.city &&
            userData.country
              ? `${userData.city}, ${userData.country}`
              : 'Non renseigné',

          accountNumber,

          manager:
            this.assignRandomManager(),

          balance: 0.00,

          isBlocked: false,

          unlockFee: 0,

          blockReason: null,

          // Nouvel utilisateur : virements autorisés
          transferBlocked: false,

          transferBlockReason: null,

          transferUnlockFee: 0,

          rib,

          cards: [
            {
              id: 1,
              type: 'Visa Premier',
              cardNumber,
              maskedNumber:
                `4532 **** **** ${lastFour}`,
              cvv:
                Math.floor(
                  100 + Math.random() * 900
                ).toString(),
              expiryDate: '12/29',
              status: 'active',
              dailyWithdrawalLimit: 0,
              weeklyPaymentLimit: 0,
              internationalPaymentEnabled:
                false,
              issueDate:
                new Date().toLocaleDateString(
                  'fr-FR',
                  {
                    month: '2-digit',
                    year: 'numeric'
                  }
                ),
              cardHolder:
                userData.name.toUpperCase(),
            }
          ],

          accounts: [
            {
              id: 1,
              type: 'Compte Courant',
              number:
                `N°*******${String(
                  Math.floor(
                    Math.random() * 10000
                  )
                ).padStart(4, '0')}`,
              balance: 0,
              icon: 'wallet'
            },
            {
              id: 2,
              type: 'Livret A',
              number:
                `N°*******${String(
                  Math.floor(
                    Math.random() * 10000
                  )
                ).padStart(4, '0')}`,
              balance: 0,
              icon: 'piggybank'
            },
            {
              id: 3,
              type: 'Plan Épargne',
              number:
                `N°*******${String(
                  Math.floor(
                    Math.random() * 10000
                  )
                ).padStart(4, '0')}`,
              balance: 0,
              icon: 'trending'
            },
          ],

          transactions: [],

          expenses: {
            month:
              new Date().toLocaleDateString(
                'fr-FR',
                {
                  month: 'long',
                  year: 'numeric'
                }
              ),

            categories: [
              {
                name: 'Logement',
                value: 0,
                color: '#3B82F6'
              },
              {
                name: 'Alimentation',
                value: 0,
                color: '#10B981'
              },
              {
                name: 'Transport',
                value: 0,
                color: '#F97316'
              },
              {
                name: 'Loisirs',
                value: 0,
                color: '#6366F1'
              },
              {
                name: 'Autres',
                value: 0,
                color: '#D1D5DB'
              },
            ],
          },

          chequier: 0,
          virementRapide: 0,
          virementProgramme: 0,
        };

        this.users.push(
          newUser
        );

        this._save();

        if (DEV_MODE) {
          console.log(
            '✅ Utilisateur créé:',
            newUser.name
          );
        }

        const {
          password: _pwd,
          ...userWithoutPassword
        } = newUser;

        resolve(
          userWithoutPassword
        );

      }, 1000);
    });
  }


  // ================================================================
  // CHANGER MOT DE PASSE
  // ================================================================

  async changePassword(
    userId,
    oldPassword,
    newPassword
  ) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const user =
          this.users.find(
            u => u.id === userId
          );

        if (!user) {
          reject(
            new Error(
              'Utilisateur non trouvé'
            )
          );
          return;
        }

        if (
          user.password !==
          oldPassword
        ) {
          reject(
            new Error(
              'Ancien mot de passe incorrect'
            )
          );
          return;
        }

        if (
          !/^\d+$/.test(
            newPassword
          )
        ) {
          reject(
            new Error(
              'Le mot de passe doit contenir uniquement des chiffres'
            )
          );
          return;
        }

        if (
          newPassword.length < 6
        ) {
          reject(
            new Error(
              'Le mot de passe doit contenir au moins 6 chiffres'
            )
          );
          return;
        }

        user.password =
          newPassword;

        this._save();

        if (DEV_MODE) {
          console.log(
            '✅ Mot de passe changé'
          );
        }

        resolve({
          success: true,
          message:
            'Mot de passe modifié avec succès'
        });

      }, 500);
    });
  }
}


// ===================================================================
// EXPORT
// ===================================================================

export default new UserService();