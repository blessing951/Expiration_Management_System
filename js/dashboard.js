console.log(
    "dashboard.js loaded"
);


// ==========================================
// LOAD ADMIN STATISTICS
// ==========================================

async function loadAdminStatistics() {

    console.log("loadAdminStatistics() started");


    // TOTAL USERS

    const {

        count: userCount,

        error: userError

    } = await supabaseClient

        .from("profiles")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        )

        .eq(
            "role",
            "user"
        );

    console.log("User Count:", userCount);
    console.log("User Error:", userError);


    if (userError) {

        console.error(
            "User Statistics Error:",
            userError
        );

    }


    document.getElementById(
        "totalUsers"
    ).textContent =

        userCount || 0;


    // TOTAL HOUSEHOLD ITEMS

    const {

        count: itemCount,

        error: itemError

    } = await supabaseClient

        .from("household_items")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        );
    console.log("Item Count:", itemCount);
    console.log("Item Error:", itemError);


    if (itemError) {

        console.error(
            "Item Statistics Error:",
            itemError
        );

    }


    document.getElementById(
        "totalItems"
    ).textContent =

        itemCount || 0;


    // EXPIRED ITEMS

    const today =
        new Date()

            .toISOString()

            .split("T")[0];


    const {

        count: expiredCount,

        error: expiredError

    } = await supabaseClient

        .from("household_items")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        )

        .lt(
            "expiry_date",
            today
        );

    console.log("Expired Count:", expiredCount);
    console.log("Expired Error:", expiredError);


    if (expiredError) {

        console.error(
            "Expired Statistics Error:",
            expiredError
        );

    }


    document.getElementById(
        "expiredItems"
    ).textContent =

        expiredCount || 0;


    // TOTAL MESSAGES

    const {

        count: messageCount,

        error: messageError

    } = await supabaseClient

        .from("messages")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        );

    console.log("Message Count:", messageCount);
    console.log("Message Error:", messageError);


    if (messageError) {

        console.error(
            "Message Statistics Error:",
            messageError
        );

    }


    document.getElementById(
        "totalMessages"
    ).textContent =

        messageCount || 0;


    console.log(

        "Statistics loaded successfully"

    );


}

// ==========================================
// RUN WHEN PAGE LOADS
// ==========================================

    document.addEventListener(

        "DOMContentLoaded",

        function () {

            console.log(
                "Admin dashboard loaded"
            );

            loadAdminStatistics();

            loadAdminExpiryItems();

        }

    );


// ==========================================
// LOAD ADMIN EXPIRY ITEMS
// ==========================================

async function loadAdminExpiryItems() {
    console.log(
        "loadAdminExpiryItems() started"
    );

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const soonDate =
        new Date();


    soonDate.setDate(
        soonDate.getDate() + 7
    );


    const soonDateString =
        soonDate
            .toISOString()
            .split("T")[0];


    // ======================================
    // EXPIRING SOON
    // ======================================

    console.log(
        "Before Soon Items Query"
    );

    const {

        data: soonItems,

        error: soonError

    } = await supabaseClient

        .from("household_items")

        .select(`
            *,
            profiles (
                username,
                full_name
            )
        `)

        .gte(
            "expiry_date",
            today
        )

        .lte(
            "expiry_date",
            soonDateString
        )

        .order(
            "expiry_date",
            {
                ascending: true
            }
        );

        console.log(
            "Soon Items:",
            soonItems
        );

        console.log(
            "Soon Error:",
            soonError
        );


    if (soonError) {

        console.error(
            "Expiring Soon Error:",
            soonError
        );

        return;

    }


    // ======================================
    // EXPIRED ITEMS
    // ======================================

    const {

        data: expiredItems,

        error: expiredError

    } = await supabaseClient

        .from("household_items")

        .select(`
            *,
            profiles (
                username,
                full_name
            )
        `)

        .lt(
            "expiry_date",
            today
        )

        .order(
            "expiry_date",
            {
                ascending: true
            }
        );

        console.log(
            "Expired Items:",
            expiredItems
        );

        console.log(
            "Expired Error:",
            expiredError
        );


    if (expiredError) {

        console.error(
            "Expired Items Error:",
            expiredError
        );

        return;

    }

    displayAdminExpiryItems(

        soonItems || [],

        expiredItems || []

    // displayAdminExpiryItems(
    //     soonItems,
    //     expiredItems
    );

}

// ==========================================
// DISPLAY ADMIN EXPIRY ITEMS
// ==========================================

function displayAdminExpiryItems(

    soonItems,

    expiredItems

) {

    const soonContainer =
        document.getElementById(
            "adminExpiringSoon"
        );


    const expiredContainer =
        document.getElementById(
            "adminExpiredItems"
        );


    if (soonContainer) {

        soonContainer.innerHTML = "";

    }


    if (expiredContainer) {

        expiredContainer.innerHTML = "";

    }


    // ======================================
    // EXPIRING SOON
    // ======================================

    soonItems.forEach(

        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-expiry-card";


            div.innerHTML = `

                <p>
                    📦 <strong>
                        ${item.item_name}
                    </strong>
                </p>

                <p>
                    📂 Category:
                    ${item.category}
                </p>

                <p>
                    👤 User:
                    ${item.profiles?.username || "Unknown User"}
                </p>

                <p>
                    📅 Expires:
                    ${item.expiry_date}
                </p>

                <button
                    class="send-alert-btn"
                    onclick="sendExpiryAlert(
                        '${item.user_id}',
                        '${item.item_name}',
                        'soon'
                    )"
                >
                    Send Alert
                </button>

            `;


            if (soonContainer) {

                soonContainer.appendChild(
                    div
                );

            }

        }

    );


    // ======================================
    // EXPIRED ITEMS
    // ======================================

    expiredItems.forEach(

        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-expiry-card";


            div.innerHTML = `

                <p>
                    ❌ <strong>
                        ${item.item_name}
                    </strong>
                </p>

                <p>
                    📂 Category:
                    ${item.category}
                </p>

                <p>
                    👤 User:
                    ${item.profiles?.username || "Unknown User"}
                </p>

                <p>
                    📅 Expired:
                    ${item.expiry_date}
                </p>

                <button
                    class="send-alert-btn"
                    onclick="sendExpiryAlert(
                        '${item.user_id}',
                        '${item.item_name}',
                        'expired'
                    )"
                >                
                    Send Alert
                </button>

            `;


            if (expiredContainer) {

                expiredContainer.appendChild(
                    div
                );

            }

        }

    );

}

// ==========================================
// SEND EXPIRY ALERT
// ==========================================

async function sendExpiryAlert(

    userId,

    itemName,

    status

) {

    let message;


    if (

        status === "soon"

    ) {

        message =
            `⚠️ Reminder: Your item "${itemName}" will expire soon.`;

    }

    else {

        message =
            `🔴 Alert: Your item "${itemName}" has expired.`;

    }


    const {

        data: {
            user: admin
        },

        error: userError

    } = await supabaseClient

        .auth

        .getUser();


    if (

        userError ||

        !admin

    ) {

        alert(
            "Admin authentication required."
        );

        return;

    }


    const {

        error

    } = await supabaseClient

        .from("messages")

        .insert([

            {

                sender_id:
                    admin.id,

                sender_role:
                    "admin",

                recipient_id:
                    userId,

                message:
                    message

            }

        ]);


    if (error) {

        console.error(
            "Expiry Alert Error:",
            error
        );


        alert(
            "Unable to send alert."
        );


        return;

    }


    alert(
        "Alert sent successfully!"
    );


    console.log(
        "Expiry alert sent to:",
        userId
    );

}