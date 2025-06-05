//
//  Message_In_A_BottleApp.swift
//  Message-In-A-Bottle
//
//  Created by Ollie Easterbrook on 05/06/2025.
//

import SwiftUI
import SwiftData

@main
struct Message_In_A_BottleApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Item.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
